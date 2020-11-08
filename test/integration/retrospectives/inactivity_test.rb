# frozen_string_literal: true

require 'test_helper'

class Retrospective::InactivityTest < ActionDispatch::IntegrationTest
  test 'facilitator token changes when facilitator logs out' do
    retrospective = create(:retrospective, step: 'thinking')
    other_participant = create(:other_participant, retrospective: retrospective)

    facilitator_window = open_new_window
    within_window(facilitator_window) do
      logged_in_as(retrospective.facilitator)
      visit single_page_app_path(path: "retrospectives/#{retrospective.id}")
      assert_logged_in(retrospective.facilitator, with_flags: %i[self facilitator])
    end

    other_participant_window = open_new_window
    within_window(other_participant_window) do
      logged_in_as(other_participant)
      visit single_page_app_path(path: "retrospectives/#{retrospective.id}")
      assert_logged_in(retrospective.facilitator, with_flags: %i[facilitator])
      assert_logged_in(other_participant, with_flags: %i[self])
    end

    freeze_time do
      assert_enqueued_with(job: InactivityJob, args: [retrospective.facilitator], at: Participant::INACTIVITY_DELAY.seconds.from_now, queue: 'default') do
        cable_connection_for(retrospective.facilitator).disconnect if headless?
        facilitator_window.close
      end
      perform_enqueued_jobs
    end

    within_window(other_participant_window) do
      assert_inactive(retrospective.facilitator)
      assert_logged_in(other_participant, with_flags: %i[self facilitator])
    end
  end

  test 'facilitator token gets back to original facilitator if he logs in again' do
    retrospective = create(:retrospective, step: 'thinking')
    other_participant = create(:other_participant, retrospective: retrospective)

    facilitator_window = open_new_window
    within_window(facilitator_window) do
      logged_in_as(retrospective.facilitator)
      visit single_page_app_path(path: "retrospectives/#{retrospective.id}")
      assert_logged_in(retrospective.facilitator, with_flags: %i[self facilitator])
    end

    freeze_time do
      assert_enqueued_with(job: InactivityJob, args: [retrospective.facilitator], at: Participant::INACTIVITY_DELAY.seconds.from_now, queue: 'default') do
        cable_connection_for(retrospective.facilitator).disconnect if headless?
        facilitator_window.close
      end
      perform_enqueued_jobs
    end

    other_participant_window = open_new_window
    within_window(other_participant_window) do
      logged_in_as(other_participant)
      visit single_page_app_path(path: "retrospectives/#{retrospective.id}")
      assert_inactive(retrospective.facilitator)
      assert_logged_in(other_participant, with_flags: %i[self facilitator])
    end

    within_window(open_new_window) do
      logged_in_as(retrospective.facilitator)
      visit single_page_app_path(path: "retrospectives/#{retrospective.id}")
      assert_logged_in(retrospective.facilitator, with_flags: %i[self facilitator])
      assert_logged_in(other_participant)
    end

    within_window(other_participant_window) do
      assert_logged_in(retrospective.facilitator, with_flags: %i[facilitator])
      assert_logged_in(other_participant, with_flags: %i[self])
    end
  end
end
