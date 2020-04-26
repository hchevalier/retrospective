require 'test_helper'

class Retrospective::JoiningTest < ActionDispatch::IntegrationTest
  test 'timer does not show in waiting lobby even when organizer' do
    retrospective = create(:retrospective)

    logged_in_as(retrospective.organizer)
    visit retrospective_path(retrospective)

    assert_logged_as_organizer
    assert_no_css('#timer')
  end

  test 'timer displays --:-- for organizer by default' do
    retrospective = create(:retrospective, step: 'thinking')

    logged_in_as(retrospective.organizer)
    visit retrospective_path(retrospective)

    assert_equal 'Timer:--:--', find('#timer').text.split("\n").join
  end

  test 'timer does not show for other participants if not running' do
    retrospective = create(:retrospective, step: 'thinking')
    other_participant = create(:other_participant, retrospective: retrospective)

    logged_in_as(other_participant)
    visit retrospective_path(retrospective)

    refute_logged_as_organizer
    assert_no_css('#timer')
  end

  test 'organizer can set timer for all participants' do
    retrospective = create(:retrospective, step: 'thinking')
    other_participant = create(:other_participant, retrospective: retrospective)

    logged_in_as(retrospective.organizer)
    visit retrospective_path(retrospective)

    find('#timer .minutes').click
    assert_text 'Set duration'
    find('span.MuiListItemText-primary', text: '08mn').click
    refute_text 'Set duration'

    # Waits for 07:59, then only have 1 second to do the following assertion
    # Risks of flakiness
    within '#timer' do
      assert_text '59'
    end
    assert_equal 'Timer:07:59', find('#timer').text.split("\n").join

    within_window(open_new_window) do
      logged_in_as(other_participant)
      visit retrospective_path(retrospective)
      within '#timer' do
        assert_text '58'
      end
      assert_equal 'Timer:07:58', find('#timer').text.split("\n").join
    end
  end
end
