# frozen_string_literal: true

require 'test_helper'

class Retrospective::VotingStepTest < ActionDispatch::IntegrationTest
  test 'all revealed reflections are displayed' do
    retrospective = create(:retrospective, step: 'voting')
    other_participant = create(:other_participant, retrospective: retrospective)
    create(:reflection, :glad, owner: retrospective.organizer)
    create(:reflection, :sad, owner: other_participant)
    unrevealed = create(:reflection, :mad, owner: other_participant, revealed: false)

    logged_in_as(retrospective.organizer)
    visit retrospective_path(retrospective)
    assert_logged_as_organizer

    assert_text 'A glad reflection'
    assert_text 'A sad reflection'
    refute_text unrevealed.content

    other_participant_window = open_new_window
    within_window(other_participant_window) do
      logged_in_as(other_participant)
      visit retrospective_path(retrospective)
      assert_text 'A glad reflection'
      assert_text 'A sad reflection'
      refute_text unrevealed.content
    end
  end

  test 'one can vote for reflections while under the maximum votes threshold' do
    retrospective = create(:retrospective, step: 'voting')
    other_participant = create(:other_participant, retrospective: retrospective)
    reflection_a = create(:reflection, :glad, owner: retrospective.organizer)
    reflection_b = create(:reflection, :sad, owner: other_participant)

    logged_in_as(retrospective.organizer)
    visit retrospective_path(retrospective)

    assert_text 'Remaining votes: 5'
    assert_votes_count(reflection_a, count: 0)
    vote_for_reflection(reflection_a, times: 4)
    assert_votes_count(reflection_a, count: 4)
    assert_text 'Remaining votes: 1'

    assert_votes_count(reflection_b, count: 0)
    vote_for_reflection(reflection_b, times: 1)
    assert_votes_count(reflection_b, count: 1)
    assert_text 'Remaining votes: 0'

    exception = assert_raises ActiveRecord::RecordInvalid do
      vote_for_reflection(reflection_b, times: 1)
    end
    assert_equal "Validation failed: Author can't vote more than 5 times per retrospective", exception.message
    assert_votes_count(reflection_b, count: 1)
    assert_text 'Remaining votes: 0'
  end

  test 'thumbs up are disabled when remaining votes reach 0' do
    retrospective = create(:retrospective, step: 'voting')
    reflection_a = create(:reflection, :glad, owner: retrospective.organizer)
    reflection_b = create(:reflection, :sad, owner: retrospective.organizer)

    logged_in_as(retrospective.organizer)
    visit retrospective_path(retrospective)

    assert_text 'Remaining votes: 5'
    assert_can_vote_for(reflection_a)
    assert_can_vote_for(reflection_b)

    vote_for_reflection(reflection_a, times: 5)
    assert_text 'Remaining votes: 0'

    refute_can_vote_for(reflection_a)
    refute_can_vote_for(reflection_b)
  end

  test 'thumbs down is disabled when there are no vote on a specific reflection' do
    retrospective = create(:retrospective, step: 'voting')
    reflection_a = create(:reflection, :glad, owner: retrospective.organizer)
    reflection_b = create(:reflection, :sad, owner: retrospective.organizer)

    logged_in_as(retrospective.organizer)
    visit retrospective_path(retrospective)

    assert_text 'Remaining votes: 5'
    refute_can_unvote(reflection_a)
    refute_can_unvote(reflection_b)

    vote_for_reflection(reflection_a)
    assert_text 'Remaining votes: 4'

    assert_can_unvote(reflection_a)
    refute_can_unvote(reflection_b)
  end

  test 'votes are private during the voting phase' do
    retrospective = create(:retrospective, step: 'voting')
    other_participant = create(:other_participant, retrospective: retrospective)
    reflection_a = create(:reflection, :glad, owner: retrospective.organizer)

    logged_in_as(retrospective.organizer)
    visit retrospective_path(retrospective)

    vote_for_reflection(reflection_a, times: 2)

    other_participant_window = open_new_window
    within_window(other_participant_window) do
      logged_in_as(other_participant)
      visit retrospective_path(retrospective)
      assert_votes_count(reflection_a, count: 0)
      vote_for_reflection(reflection_a, times: 3)
    end

    assert_votes_count(reflection_a, count: 2)
  end

  test 'organizer can see remaining votes for each participant' do
    retrospective = create(:retrospective, step: 'voting')
    other_participant = create(:other_participant, retrospective: retrospective)
    reflection_a = create(:reflection, :glad, owner: retrospective.organizer)

    logged_in_as(retrospective.organizer)
    visit retrospective_path(retrospective)

    assert_remaining_votes_for(retrospective.organizer, 5)
    vote_for_reflection(reflection_a, times: 2)
    assert_remaining_votes_for(retrospective.organizer, 3)

    assert_remaining_votes_for(other_participant, 5)

    other_participant_window = open_new_window
    within_window(other_participant_window) do
      logged_in_as(other_participant)
      visit retrospective_path(retrospective)
      assert_votes_count(reflection_a, count: 0)
      vote_for_reflection(reflection_a, times: 3)

      refute_css "#participants-list .avatar[data-id='#{retrospective.organizer.id}'] .remaining-votes"
      refute_css "#participants-list .avatar[data-id='#{other_participant.id}'] .remaining-votes"
    end

    logged_in_as(retrospective.organizer)
    assert_remaining_votes_for(other_participant, 2)
    unvote_for_reflection(reflection_a, times: 2)
    assert_remaining_votes_for(retrospective.organizer, 5)
  end

  test 'new organizer can see remaining votes if original one is inactive' do
    retrospective = create(:retrospective, step: 'voting')
    other_participant = create(:other_participant, retrospective: retrospective)
    reflection_a = create(:reflection, :glad, owner: retrospective.organizer)

    organizer_window = open_new_window
    within_window(organizer_window) do
      logged_in_as(retrospective.organizer)
      visit retrospective_path(retrospective)

      assert_logged_in(retrospective.organizer, with_flags: %i(self organizer))
      assert_remaining_votes_for(retrospective.organizer, 5)
      vote_for_reflection(reflection_a, times: 2)
    end

    cable_connection_for(retrospective.organizer).disconnect if headless?
    organizer_window.close
    perform_enqueued_jobs

    logged_in_as(other_participant)
    visit retrospective_path(retrospective)
    assert_logged_in(other_participant, with_flags: %i(self organizer))
    assert_votes_count(reflection_a, count: 0)
    assert_remaining_votes_for(retrospective.organizer, 3)
  end

  test 'vote occurs at topic level for grouped reflections' do
    retrospective = create(:retrospective, step: 'voting')
    reflection_a = create(:reflection, :glad, owner: retrospective.organizer, content: 'First reflection')
    reflection_b = create(:reflection, :glad, owner: retrospective.organizer, content: 'Second reflection')
    topic = create(:topic, retrospective: retrospective, reflections: [reflection_a, reflection_b])

    logged_in_as(retrospective.organizer)
    visit retrospective_path(retrospective)
    assert_remaining_votes_for(retrospective.organizer, 5)

    topic_container = find(".topic[data-id='#{topic.id}']").ancestor('.topic-container')
    within topic_container do
      assert_selector '.vote-corner', count: 1
    end

    vote_for_topic(topic, times: 4)
    assert_topic_votes_count(topic, count: 4)
    unvote_for_topic(topic, times: 3)
    assert_topic_votes_count(topic, count: 1)
  end

  private

  def vote_for_reflection(reflection, times: 1)
    within ".reflection[data-id='#{reflection.id}'] .vote-corner" do
      times.times do
        vote_count = find('.vote-count').text.to_i
        find('.vote').click
        assert_text vote_count + 1
      end
    end
  end

  def unvote_for_reflection(reflection, times: 1)
    within ".reflection[data-id='#{reflection.id}'] .vote-corner" do
      times.times do
        vote_count = find('.vote-count').text.to_i
        find('.unvote').click
        assert_text vote_count - 1
      end
    end
  end

  def vote_for_topic(topic, times: 1)
    within find(".topic[data-id='#{topic.id}']").ancestor('.topic-container') do
      within ".vote-corner" do
        times.times do
          vote_count = find('.vote-count').text.to_i
          find('.vote').click
          assert_text vote_count + 1
        end
      end
    end
  end

  def unvote_for_topic(topic, times: 1)
    within find(".topic[data-id='#{topic.id}']").ancestor('.topic-container') do
      within ".vote-corner" do
        times.times do
          vote_count = find('.vote-count').text.to_i
          find('.unvote').click
          assert_text vote_count - 1
        end
      end
    end
  end

  def assert_votes_count(reflection, count:)
    within ".reflection[data-id='#{reflection.id}'] .vote-corner" do
      assert_equal count, find('.vote-count').text.to_i
    end
  end

  def assert_topic_votes_count(topic, count:)
    within find(".topic[data-id='#{topic.id}']").ancestor('.topic-container') do
      within ".vote-corner" do
        assert_equal count, find('.vote-count').text.to_i
      end
    end
  end

  def assert_remaining_votes_for(participant, count)
    within "#participants-list .avatar[data-id='#{participant.id}'] .remaining-votes" do
      assert_text count
    end
  end

  def assert_can_vote_for(reflection)
    within ".reflection[data-id='#{reflection.id}'] .vote-corner" do
      refute_css '.vote.disabled'
    end
  end

  def refute_can_vote_for(reflection)
    within ".reflection[data-id='#{reflection.id}'] .vote-corner" do
      assert_css '.vote.disabled'
    end
  end

  def assert_can_unvote(reflection)
    within ".reflection[data-id='#{reflection.id}'] .vote-corner" do
      refute_css '.unvote.disabled'
    end
  end

  def refute_can_unvote(reflection)
    within ".reflection[data-id='#{reflection.id}'] .vote-corner" do
      assert_css '.unvote.disabled'
    end
  end
end
