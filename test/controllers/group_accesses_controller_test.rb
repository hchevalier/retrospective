require 'test_helper'

class GroupsAccessesControllerTest < ActionDispatch::IntegrationTest
  setup do
    ApplicationController.allow_forgery_protection = false
    @account = create(:account, username: 'Groupie')
    as_user(@account)
    @group = create(:group, name: 'MyGroupName')
    @other_account = create(:account, username: 'Other member')
  end

  teardown do
    ApplicationController.allow_forgery_protection = true
  end

  test 'current account does not have access to the group and cannot revoke access of a member' do
    @group.add_member(@other_account)
    delete "/api/groups/#{@group.id}/accounts/#{@other_account.public_id}"
    assert_response :forbidden
  end

  test 'the group does not exist' do
    @group.add_member(@account)
    @group.add_member(@other_account)
    delete "/api/groups/000/accounts/#{@other_account.public_id}"
    assert_response :forbidden
  end

  test 'cannot revoke access to an account which is not in the group' do
    @group.add_member(@account)
    delete "/api/groups/#{@group.id}/accounts/#{@other_account.public_id}"
    assert_response :not_found
  end
end
