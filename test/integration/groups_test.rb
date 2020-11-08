# frozen_string_literal: true

require 'test_helper'

class GroupsTest < ActionDispatch::IntegrationTest
  setup do
    @account = create(:account, username: 'Groupie')
    as_user(@account)
  end

  test 'creating a group makes account automatically join it' do
    visit '/groups'
    click_on 'CREATE A GROUP', match: :first

    fill_in 'group_name', with: 'MyGroupName'
    click_on 'Create'

    assert_text 'My groups', count: 2
    assert_text 'MyGroupName'

    assert_includes Group.last.accounts_without_revoked.ids, @account.id
  end

  test 'shows the number of members in a group' do
    group = create(:group, name: 'MyGroupName')
    group.add_member(@account)

    visit '/groups'
    assert_text '1 members'

    other_account = create(:account, username: 'Other member')
    group.add_member(other_account)

    visit '/groups'
    assert_text '2 members'

    group.group_accesses.find_by(account: other_account).update!(revoked_at: Time.current)

    visit '/groups'
    assert_text '1 members'
  end

  test 'hides groups that have been left' do
    group = create(:group, name: 'MyGroupName')
    group.add_member(@account)

    visit '/groups'
    assert_text 'MyGroupName'

    accept_confirm do
      click_on 'LEAVE'
    end

    refute_text 'MyGroupName'

    refute_nil group.group_accesses.find_by(account: @account).revoked_at
  end

  test 'deletes abandoned groups' do
    group = create(:group, name: 'MyGroupName')
    group.add_member(@account)

    other_account = create(:account, username: 'Other member')
    group.add_member(other_account)

    visit '/groups'
    assert_text 'MyGroupName'

    accept_confirm do
      click_on 'LEAVE'
    end
    refute_text 'MyGroupName'

    as_user(other_account)

    visit '/groups'
    assert_text 'MyGroupName'

    accept_confirm do
      click_on 'LEAVE'
    end
    refute_text 'MyGroupName'

    refute_nil group.reload.deleted_at
  end

  test 'shows the list of active members' do
    group = create(:group, name: 'MyGroupName')
    group.add_member(@account)

    other_account = create(:account, username: 'Other member')
    group.add_member(other_account)

    visit '/groups'
    click_on 'MyGroupName'

    assert_text 'MyGroupName'
    assert_text 'Group members (2)'
    assert_text 'Groupie'
    assert_text 'Other member'
  end

  test 'do not show old members unless they have a new active access' do
    group = create(:group, name: 'MyGroupName')
    group.add_member(@account)

    other_account = create(:account, username: 'Other member')
    group.add_member(other_account)
    group.group_accesses.find_by(account: other_account).update!(revoked_at: Time.current)

    visit "/groups/#{group.id}"
    assert_text 'Group members (1)'
    refute_text 'Other member'

    group.add_member(other_account)

    visit "/groups/#{group.id}"
    assert_text 'Group members (2)'
    assert_text 'Other member', count: 1
  end

  test 'shows all tasks created when user was part of the group as long as he has one active access' do
    group = create(:group, name: 'MyGroupName')
    group.add_member(@account)
    other_account = create(:account)
    group.add_member(other_account)

    # can see tasks created during this retrospective
    do_a_retrospective_with_actions(group, 'Reflection 1', 'Retrospective 1 action', @account, other_account)
    visit "/groups/#{group.id}"
    assert_text 'Retrospective 1 action', count: 2
    assert_text 'Reflection 1'

    group.group_accesses.where(account: @account, revoked_at: nil).update_all(revoked_at: Time.current)

    retrospective2 = do_a_retrospective_with_actions(group, 'Reflection 2', 'Retrospective 2 action', other_account)
    retrospective3 = do_a_retrospective_with_actions(group, 'Reflection 3', 'Retrospective 3 action', other_account)
    retrospective3.tasks.update_all(status: :done, updated_at: Time.current)

    group.add_member(@account)
    # can see pending tasks created during this second retrospective thanks to the active access, even if they change status
    # cannot see tasks that were created during the third retrospective because they were closed before he had a chance to see them
    visit "/groups/#{group.id}"
    assert_text 'Actions'
    click_on 'SEE DONE'
    assert_text 'Retrospective 1 action', count: 2
    assert_text 'Reflection 1'
    assert_text 'Retrospective 2 action'
    assert_text 'Reflection 2'
    refute_text 'Retrospective 3 action'
    refute_text 'Reflection 3'

    retrospective2.tasks.update_all(status: :done, updated_at: Time.current)
    # @account can see all tasks created during this retrospective as he has any active access at this time, even if he did not participate
    do_a_retrospective_with_actions(group, 'Reflection 4', 'Retrospective 4 action', other_account)

    visit "/groups/#{group.id}"
    assert_text 'Actions'
    click_on 'SEE DONE'
    assert_text 'Retrospective 2 action'
    assert_text 'Reflection 2'
    assert_text 'Retrospective 4 action'
    assert_text 'Reflection 4'
  end

  test 'hides done tasks by default' do
    group = create(:group, name: 'MyGroupName')
    group.add_member(@account)

    # can see tasks created during this retrospective
    do_a_retrospective_with_actions(group, 'Reflection 1', 'Retrospective 1 action', @account)
    visit "/groups/#{group.id}"
    assert_text 'Retrospective 1 action'
    refute_text 'No action'

    Task.last.update!(status: :done)

    visit "/groups/#{group.id}"
    refute_text 'Retrospective 1 action'
    assert_text 'No action'
    click_on 'SEE DONE'

    assert_text 'Retrospective 1 action'
    refute_text 'No action'
  end

  test 'changes the next scheduled retrospective' do
    group = create(:group, name: 'MyGroupName')
    group.add_member(@account)

    freeze_time do
      first_monday = Time.current.beginning_of_month.beginning_of_week

      visit '/'
      assert_text 'No scheduled retrospective'
      refute_text 'MyGroupName'

      visit "/groups/#{group.id}"
      find('.react-datetime-picker__calendar-button').click
      assert_selector '.react-calendar__tile'
      find('.react-calendar__tile', match: :first).click
      assert_field 'day', with: first_monday.strftime('%-d')
      assert_field 'month', with: first_monday.strftime('%-m')
      assert_field 'year', with: first_monday.strftime('%Y')
      find_field('hour24').native.clear
      find_field('hour24').native.send_keys(:numpad1, :numpad2)
      find_field('minute').native.clear
      find_field('minute').native.send_keys(:numpad3, :numpad0)

      visit '/'
      refute_text 'No scheduled retrospective'
      assert_text "#{first_monday.strftime('%d/%m')} at 12:30 with MyGroupName", normalize_ws: true
    end
  end

  private

  def do_a_retrospective_with_actions(group, content, task_description, *accounts)
    facilitator_account = accounts.first
    retrospective =
      Retrospective.create!(kind: :glad_sad_mad, group: group, facilitator_attributes: {
        surname: facilitator_account.username, account_id: facilitator_account.id
      })
    facilitator = retrospective.facilitator
    accounts[1..].each do |account|
      Participant.create!(account: account, retrospective: retrospective, surname: account.username)
    end
    reflection = create(:reflection, :glad, retrospective: retrospective, owner: facilitator, content: content)
    retrospective.reload.participants.each do |participant|
      create(:task, reflection: reflection, description: task_description, author: facilitator, assignee: participant.account)
    end

    retrospective
  end
end
