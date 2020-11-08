require 'test_helper'

class GroupsAccessesTest < ActionDispatch::IntegrationTest
  setup do
    @account = create(:account, username: 'Groupie')
    @other_account = create(:account, username: 'Other member')

    @group = create(:group, name: 'MyGroupName')
    @group.add_member(@account)
    @group.add_member(@other_account)

    as_user(@account)
    visit '/groups'
  end

  test 'display revoke access button for all members except current account' do
    assert_text 'Created on'
    click_on 'MyGroupName'
    assert_text 'Group members (2)'
    assert_text 'REMOVE', count: 1
  end

  test 'revoke access of a member' do
    assert_text 'Created on'
    click_on 'MyGroupName'
    assert_text 'Other member'
    assert_text 'Group members (2)'
    accept_confirm do
      click_on 'REMOVE'
    end
    refute_text 'Other member'
    assert_text 'Group members (1)'
    assert_not_nil @group.group_accesses.find_by(account: @other_account).revoked_at
  end
end
