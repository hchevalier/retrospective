require 'test_helper'

class Retrospective::GroupingStepTest < ActionDispatch::IntegrationTest
  test 'can trigger the grouping step for other participants' do
    retrospective = create_retrospective!(step: 'thinking')
    other_participant = add_another_participant(retrospective, surname: 'Other one', email: 'other_one@yopmail.com')

    logged_in_as(@organizer)
    visit retrospective_path(retrospective)
    assert_logged_as_organizer
    assert_retro_started
    assert_text 'NEW REFLECTION'

    other_participant_window = open_new_window
    within_window(other_participant_window) do
      logged_in_as(other_participant)
      visit retrospective_path(retrospective)
      assert_retro_started
      assert_text 'NEW REFLECTION'
    end

    click_on 'Next'
    assert_text 'Click on a participant so that he can reveal his reflections'
    refute_text 'NEW REFLECTION'

    within_window(other_participant_window) do
      assert_text 'The organizer now chooses a participant so that he can reveal his reflections'
      refute_text 'NEW REFLECTION'
    end
  end

  test 'can choose a participant to be the revealer' do
    retrospective = create_retrospective!(step: 'grouping')
    other_participant = add_another_participant(retrospective, surname: 'Other one', email: 'other_one@yopmail.com')

    logged_in_as(@organizer)
    visit retrospective_path(retrospective)
    assert_logged_as_organizer
    assert_logged_in(other_participant, with_flags: :none)

    find(".participant[data-id='#{other_participant.id}']").click
    assert_logged_in(other_participant, with_flags: '(reveal.)')
  end

  test 'revealer sees his reflections and looses the revealer token when closing the modal' do
    retrospective = create_retrospective!(step: 'grouping')
    other_participant = add_another_participant(retrospective, surname: 'Other one', email: 'other_one@yopmail.com')
    create_reflection(zone: 'Glad', content: 'A glad reflection', participant: other_participant)

    other_participant_window = open_new_window
    within_window(other_participant_window) do
      logged_in_as(other_participant)
      visit retrospective_path(retrospective)
      assert_logged_in(other_participant, with_flags: '(you)')
      refute_text 'A glad reflection'
    end

    logged_in_as(@organizer)
    visit retrospective_path(retrospective)
    assert_logged_as_organizer
    find(".participant[data-id='#{other_participant.id}']").click
    refute_text 'A glad reflection'

    within_window(other_participant_window) do
      assert_logged_in(other_participant, with_flags: '(you, reveal.)')
      assert_text 'A glad reflection'
      click_on 'Reveal'
      click_on 'Close'
      assert_logged_in(other_participant, with_flags: '(you)')
    end

    assert_text 'A glad reflection'
  end
end
