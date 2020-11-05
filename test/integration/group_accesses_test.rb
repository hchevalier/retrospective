require 'test_helper'

class GroupsTest < ActionDispatch::IntegrationTest
  setup do
    @account = create(:account, username: 'Groupie')
    as_user(@account)
  end

  test 'display revoke access button for all members except current account' do
    group = create(:group, name: 'MyGroupName')
    group.add_member(@account)
    other_account = create(:account, username: 'Other member')
    group.add_member(other_account)

    visit '/groups'
    click_on 'MyGroupName'
    assert_text 'Group members (2)'
    assert_text 'REMOVE', count: 1
  end
end
