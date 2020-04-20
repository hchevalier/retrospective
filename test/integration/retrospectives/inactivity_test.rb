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

    freeze_time do
      assert_enqueued_with(job: InactivityJob, args: [@organizer], at: Participant::INACTIVITY_DELAY.seconds.from_now, queue: 'default') do
        cable_connection_for(@organizer).disconnect if headless?
        organizer_window.close
      end
      perform_enqueued_jobs
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

    freeze_time do
      assert_enqueued_with(job: InactivityJob, args: [@organizer], at: Participant::INACTIVITY_DELAY.seconds.from_now, queue: 'default') do
        cable_connection_for(@organizer).disconnect if headless?
        organizer_window.close
      end
      perform_enqueued_jobs
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

  private

  def headless?
    Capybara.current_driver.match? /headless/
  end

  def cable_connection_for(participant)
    ActionCable.server.remote_connections.where(current_user: participant, anonymous_uuid: nil)
  end
end
