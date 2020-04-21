# frozen_string_literal: true

require 'test_helper'

class Retrospective::ActionsStepTest < ActionDispatch::IntegrationTest
  test 'initial discussed reflection is the one with most votes' do
    retrospective = create(:retrospective, step: 'voting')
    other_participant = create(:other_participant, retrospective: retrospective)
    reflection_a = create(:reflection, :glad, owner: retrospective.organizer)
    reflection_b = create(:reflection, :sad, owner: other_participant)
    create_list(:vote, 3, target: reflection_a, author: retrospective.organizer)
    create_list(:vote, 2, target: reflection_b, author: other_participant)

    logged_in_as(retrospective.organizer)
    visit retrospective_path(retrospective)

    click_on 'Next'
    within '.reflection' do
      assert_text 'A glad reflection'
    end

    other_participant_window = open_new_window
    within_window(other_participant_window) do
      logged_in_as(other_participant)
      visit retrospective_path(retrospective)

      within '.reflection' do
        assert_text 'A glad reflection'
      end
    end
  end

  test 'organizer can change the discussed reflection' do
    retrospective = create(:retrospective, step: 'actions')
    other_participant = create(:other_participant, retrospective: retrospective)
    reflection_a = create(:reflection, :glad, owner: retrospective.organizer)
    create(:reflection, :sad, owner: other_participant)
    create(:vote, target: reflection_a, author: retrospective.organizer)
    retrospective.update!(discussed_reflection: reflection_a)

    logged_in_as(retrospective.organizer)
    visit retrospective_path(retrospective)

    within '.reflection' do
      assert_text 'A glad reflection'
    end

    all('#reflections-list .sticky-bookmark').last.click

    within '.reflection' do
      assert_text 'A sad reflection'
    end

    other_participant_window = open_new_window
    within_window(other_participant_window) do
      logged_in_as(other_participant)
      visit retrospective_path(retrospective)

      within '.reflection' do
        assert_text 'A sad reflection'
      end

      all('#reflections-list .sticky-bookmark').first.click

      within '.reflection' do
        assert_text 'A sad reflection'
      end
    end
  end

  test 'ensure votes are closed' do
    retrospective = create(:retrospective, step: 'actions')
    reflection = create(:reflection, :glad, owner: retrospective.organizer)
    retrospective.update!(discussed_reflection: reflection)
    logged_in_as(retrospective.organizer)
    visit retrospective_path(retrospective)
    within ".reflection[data-id='#{reflection.id}'] .vote-corner" do
      refute_css '.vote'
      refute_css '.unvote'
    end
  end
end
