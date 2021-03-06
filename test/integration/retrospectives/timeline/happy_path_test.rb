# frozen_string_literal: true

require 'test_helper'

class Retrospective::TimelineHappyPathTest < ActionDispatch::IntegrationTest
  test 'ensure timeline retrospective works' do
    account = create(:account)
    group = create(:group, name: 'MyGroupName')
    group.add_member(account)
    as_user(account)

    travel_to Time.parse('2021-04-22T12:00:00+0200')

    visit '/'
    click_on 'START'

    find('input[name="group_name"]').click
    assert_text 'MyGroupName'
    find('[name="group_name_dropdown"] div', text: 'MyGroupName', match: :first).click
    assert_field 'group_name', with: 'MyGroupName'

    select 'Timeline with emotions curve', from: 'retrospective_kind'

    find('input[name="weeks"]').click
    assert_text '2'
    find('[name="weeks_dropdown"] div', text: '2', match: :first).click
    assert_field 'weeks', with: '2'

    click_on 'START RETROSPECTIVE'

    assert_text 'Lobby MyGroupName'
    two_weeks_ago = '08/04'
    today = '22/04'

    retrospective = account.participants.first.retrospective
    other_participant = create(:other_participant, retrospective: retrospective, created_at: 1.second.from_now)
    other_participant.account.update!(username: 'other')
    other_partipant_window = open_new_window
    within_window(other_partipant_window) do
      logged_in_as(other_participant)
      visit single_page_app_path(path: "retrospectives/#{retrospective.id}")
      assert_text 'Lobby MyGroupName'
    end
    logged_in_as(retrospective.facilitator)

    next_step
    # Thinking step
    assert_text two_weeks_ago
    assert_text today

    refute_reflection_in_zone(two_weeks_ago)
    refute_reflection_in_zone(today)

    find('.reflection-content-container').click
    fill_in 'content', with: 'First reflection'
    find('textarea[name="content"]').send_keys(:tab)
    assert_selector '.highlight'
    find('.zone', text: two_weeks_ago).click
    assert_reflection_in_zone(two_weeks_ago)

    find_all('.reflection-content-container').last.click
    fill_in 'content', with: 'Second reflection'
    find('textarea[name="content"]').send_keys(:tab)
    assert_selector '.highlight'
    find('.zone', text: today).click
    assert_reflection_in_zone(today)

    first_reflection = Reflection.find_by(content: 'First reflection')
    second_reflection = Reflection.find_by(content: 'Second reflection')

    thirteen_days_ago = '09/04'
    refute_reflection_in_zone(thirteen_days_ago)
    within '#timeline' do
      target_zone = find(".zone[data-id='#{Zone.find_by(identifier: thirteen_days_ago).id}']")
      sticky_note(first_reflection).drag_to(target_zone)
    end
    assert_reflection_in_zone(thirteen_days_ago)

    next_step
    # Grouping step
    assert_text 'Hover the question mark to display instructions for this step'
    assert_selector '.avatar.clickable'
    find(".avatar[data-id='#{account.participants.first.id}']").click
    within '#reflections-container' do
      assert_selector '.eye-icon', count: 2
      find('.eye-icon', match: :first).click
      refute_text 'First reflection'
      find('.eye-icon', match: :first).click
      refute_text 'Second reflection'
      refute_text 'My reflections'
    end

    next_step
    # Voting step
    assert_selector '.zone-header', count: 2
    within find_all('.zone-header').first do
      find('div.cursor-pointer', text: '1').click
      assert_selector('.active')
    end
    within find_all('.zone-header').last do
      find('div.cursor-pointer', text: '4').click
      assert_selector('.active')
    end
    within ".reflection[data-id='#{first_reflection.id}'] .vote-corner" do
      find('.vote').click
      assert_text 1
    end
    within ".reflection[data-id='#{second_reflection.id}'] .vote-corner" do
      find('.vote').click
      assert_text 1
    end

    within_window(other_partipant_window) do
      logged_in_as(other_participant)
      within find_all('.zone-header').first do
        find('div.cursor-pointer', text: '4').click
        assert_selector('.active')
      end
      within find_all('.zone-header').last do
        find('div.cursor-pointer', text: '1').click
        assert_selector('.active')
      end
    end
    logged_in_as(retrospective.facilitator)

    next_step
    # Actions step
    fill_in 'content', with: 'my task'
    select 'account', from: 'assignee'
    click_on 'Take action'

    within '#tasks-list' do
      assert_text 'Assigned to account'
      assert_text 'my task'
    end

    within_window(other_partipant_window) do
      assert_selector 'canvas'
    end

    click_on 'Finish'
    click_on 'Confirm'
  end
end
