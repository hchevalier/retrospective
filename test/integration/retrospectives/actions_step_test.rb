require 'test_helper'

class Retrospective::ActionsStepTest < ActionDispatch::IntegrationTest
  test 'initial discussed reflection is the one with most votes' do
    retrospective = create_retrospective!(step: 'voting')
    other_participant = add_another_participant(retrospective, surname: 'Other one', email: 'other_one@yopmail.com')
    reflection_a = create_reflection(zone: 'Glad', content: 'A glad reflection', participant: @organizer, revealed: true)
    reflection_b = create_reflection(zone: 'Sad', content: 'A sad reflection', participant: other_participant, revealed: true)
    create_vote(reflection_a, participant: @organizer, count: 3)
    create_vote(reflection_b, participant: other_participant, count: 2)

    logged_in_as(@organizer)
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
    retrospective = create_retrospective!(step: 'actions')
    other_participant = add_another_participant(retrospective, surname: 'Other one', email: 'other_one@yopmail.com')
    reflection_a = create_reflection(zone: 'Glad', content: 'A glad reflection', participant: @organizer, revealed: true)
    reflection_b = create_reflection(zone: 'Sad', content: 'A sad reflection', participant: other_participant, revealed: true)
    create_vote(reflection_a, participant: @organizer)
    retrospective.update!(discussed_reflection: reflection_a)

    logged_in_as(@organizer)
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
    retrospective = create_retrospective!(step: 'actions')
    reflection = create_reflection(zone: 'Glad', content: 'A glad reflection', participant: @organizer, revealed: true)
    retrospective.update!(discussed_reflection: reflection)
    logged_in_as(@organizer)
    visit retrospective_path(retrospective)
    within ".reflection[data-id='#{reflection.id}'] .vote-corner" do
      refute_css '.vote'
    end
  end
end
