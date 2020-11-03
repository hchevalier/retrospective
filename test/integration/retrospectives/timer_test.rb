# frozen_string_literal: true

require 'test_helper'

class Retrospective::JoiningTest < ActionDispatch::IntegrationTest
  test 'timer does not show in waiting lobby even when facilitator' do
    retrospective = create(:retrospective)

    logged_in_as(retrospective.facilitator)
    visit single_page_app_path(path: "retrospectives/#{retrospective.id}")

    assert_logged_as_facilitator
    assert_no_css('#timer')
  end

  test 'timer displays --:-- for facilitator by default' do
    retrospective = create(:retrospective, step: 'thinking')

    logged_in_as(retrospective.facilitator)
    visit single_page_app_path(path: "retrospectives/#{retrospective.id}")

    assert_equal 'Timer:--:--', find('#timer').text.split("\n").join
  end

  test 'timer does not show for other participants if not running' do
    retrospective = create(:retrospective, step: 'thinking')
    other_participant = create(:other_participant, retrospective: retrospective)

    logged_in_as(other_participant)
    visit single_page_app_path(path: "retrospectives/#{retrospective.id}")

    refute_logged_as_facilitator
    assert_no_css('#timer')
  end

  test 'facilitator can set timer for all participants' do
    retrospective = create(:retrospective, step: 'thinking')
    other_participant = create(:other_participant, retrospective: retrospective)

    logged_in_as(retrospective.facilitator)
    visit single_page_app_path(path: "retrospectives/#{retrospective.id}")

    find('#timer .minutes').click
    assert_text 'Set duration'
    click_on '08mn'
    refute_text 'Set duration'

    # Waits for 07:59, then only have 1 second to do the following assertion
    # Risks of flakiness
    within '#timer' do
      assert_text '59'
    end
    assert_equal 'Timer:07:59', find('#timer').text.split("\n").join

    within_window(open_new_window) do
      logged_in_as(other_participant)
      visit single_page_app_path(path: "retrospectives/#{retrospective.id}")
      within '#timer' do
        assert_text '58'
      end
      assert_equal 'Timer:07:58', find('#timer').text.split("\n").join
    end
  end
end
