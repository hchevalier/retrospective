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

  test 'it shows the remove button for everyone except the current member' do
    assert_text 'Created on'
    click_on 'MyGroupName'
    assert_text 'Group members (2)'
    within find('li', text: 'Groupie') do
      refute_text 'REMOVE'
    end
    within find('li', text: 'Other member') do
      assert_text 'REMOVE'
    end
  end

  test 'revoke access of a member' do
    assert_text 'Created on'
    click_on 'MyGroupName'
    assert_text 'Other member'
    assert_text 'Group members (2)'
    within find('li', text: 'Other member') do
      accept_confirm do
        click_on 'REMOVE'
      end
    end
    refute_text 'Other member'
    assert_text 'Group members (1)'
    assert_not_nil @group.group_accesses.find_by(account: @other_account).revoked_at
  end
end
