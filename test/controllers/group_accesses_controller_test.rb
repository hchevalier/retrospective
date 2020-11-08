require 'test_helper'

class GroupsAccessesControllerTest < ActionDispatch::IntegrationTest
  setup do
    ApplicationController.allow_forgery_protection = false
    @account = create(:account, username: 'Groupie')
    as_user(@account)
  end

  teardown do
    ApplicationController.allow_forgery_protection = true
  end

  test 'external person of a group cannot revoke access of a member' do
    group = create(:group, name: 'MyGroupName')
    other_account = create(:account, username: 'Other member')
    group.add_member(other_account)

    delete "/api/groups/#{group.id}/accounts/#{other_account.public_id}"
    assert_response :not_found
  end

  test 'it raises error if given parameters are wrong' do
    delete "/api/groups/000/accounts/000"
    assert_response :not_found
  end
end
