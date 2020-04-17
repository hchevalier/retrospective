require 'test_helper'

class Retrospective::VotingStepTest < ActionDispatch::IntegrationTest
  test 'all revealed reflections are displayed' do
    retrospective = create_retrospective!(step: 'voting')
    other_participant = add_another_participant(retrospective, surname: 'Other one', email: 'other_one@yopmail.com')
    create_reflection(zone: 'Glad', content: 'A glad reflection', participant: @organizer, revealed: true)
    create_reflection(zone: 'Sad', content: 'A sad reflection', participant: other_participant, revealed: true)
    unrevealed = create_reflection(zone: 'Mad', content: 'An unrevealed reflection', participant: other_participant, revealed: false)

    logged_in_as(@organizer)
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
    retrospective = create_retrospective!(step: 'voting')
    other_participant = add_another_participant(retrospective, surname: 'Other one', email: 'other_one@yopmail.com')
    reflection_a = create_reflection(zone: 'Glad', content: 'A glad reflection', participant: @organizer, revealed: true)
    reflection_b = create_reflection(zone: 'Sad', content: 'A sad reflection', participant: other_participant, revealed: true)

    logged_in_as(@organizer)
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
    retrospective = create_retrospective!(step: 'voting')
    reflection_a = create_reflection(zone: 'Glad', content: 'A glad reflection', participant: @organizer, revealed: true)
    reflection_b = create_reflection(zone: 'Sad', content: 'A sad reflection', participant: @organizer, revealed: true)

    logged_in_as(@organizer)
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
    retrospective = create_retrospective!(step: 'voting')
    reflection_a = create_reflection(zone: 'Glad', content: 'A glad reflection', participant: @organizer, revealed: true)
    reflection_b = create_reflection(zone: 'Sad', content: 'A sad reflection', participant: @organizer, revealed: true)

    logged_in_as(@organizer)
    visit retrospective_path(retrospective)

    assert_text 'Remaining votes: 5'
    refute_can_unvote(reflection_a)
    refute_can_unvote(reflection_b)

    vote_for_reflection(reflection_a)
    assert_text 'Remaining votes: 4'

    assert_can_unvote(reflection_a)
    refute_can_unvote(reflection_b)
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

  def assert_votes_count(reflection, count:)
    within ".reflection[data-id='#{reflection.id}'] .vote-corner" do
      assert_equal count, find('.vote-count').text.to_i
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
