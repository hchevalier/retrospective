require 'test_helper'

class LogoutTest < ActionDispatch::IntegrationTest
  test 'logout successfully' do
    account = create(:account)
    as_user(account)

    visit '/'
    assert_text 'My actions'
    click_on 'Log out'

    assert_text 'Log in'
  end
end
