require 'test_helper'

class Retrospective::InactivityTest < ActionDispatch::IntegrationTest
  test 'organizer token changes when organizer logs out' do
    retrospective = create_retrospective!(step: 'thinking')
    other_participant = add_another_participant(retrospective, surname: 'Other one', email: 'other_one@yopmail.com')

    organizer_window = open_new_window
    within_window(organizer_window) do
      logged_in_as(@organizer)
      visit retrospective_path(retrospective)
      assert_logged_in(@organizer, with_flags: '(you, orga.)')
    end

    other_participant_window = open_new_window
    within_window(other_participant_window) do
      logged_in_as(other_participant)
      visit retrospective_path(retrospective)
      assert_logged_in(@organizer, with_flags: '(orga.)')
      assert_logged_in(other_participant, with_flags: '(you)')
    end

    assert_performed_with(job: InactivityJob, args: [@organizer]) do
      organizer_window.close
    end

    within_window(other_participant_window) do
      assert_inactive(@organizer)
      assert_logged_in(other_participant, with_flags: '(you, orga.)')
    end
  end

  test 'organizer token gets back to original organizer if he logs in again' do
    retrospective = create_retrospective!(step: 'thinking')
    other_participant = add_another_participant(retrospective, surname: 'Other one', email: 'other_one@yopmail.com')

    organizer_window = open_new_window
    within_window(organizer_window) do
      logged_in_as(@organizer)
      visit retrospective_path(retrospective)
      assert_logged_in(@organizer, with_flags: '(you, orga.)')
    end

    assert_performed_with(job: InactivityJob, args: [@organizer]) do
      organizer_window.close
    end

    other_participant_window = open_new_window
    within_window(other_participant_window) do
      logged_in_as(other_participant)
      visit retrospective_path(retrospective)
      assert_inactive(@organizer)
      assert_logged_in(other_participant, with_flags: '(you, orga.)')
    end

    within_window(open_new_window) do
      logged_in_as(@organizer)
      visit retrospective_path(retrospective)
      assert_logged_in(@organizer, with_flags: '(you, orga.)')
      assert_logged_in(other_participant)
    end

    within_window(other_participant_window) do
      assert_logged_in(@organizer, with_flags: '(orga.)')
      assert_logged_in(other_participant, with_flags: '(you)')
    end
  end
end
