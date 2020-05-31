require 'test_helper'

class PasswordResetTest < ActionDispatch::IntegrationTest
  test 'fill a password reset form' do
    account = create(:account, email: 'my_account@yopmail.com', password: '1234567890')

    assert_nil account.password_reset_token

    visit '/'
    fill_in 'email', with: account.email
    click_on 'I forgot my password'

    assert_text 'An email has been sent'

    email = ActionMailer::Base.deliveries.last
    assert_equal ['noreply@docto-retrospective.herokuapp.com'], email.from
    assert_equal [account.email], email.to
    assert_equal 'Password reset', email.subject

    account.reload
    refute_nil account.password_reset_token
    expected_link = <<-HTML
      <a href="https://docto-retrospective.herokuapp.com/password_reset/#{account.password_reset_token}">this link</a>
    HTML
    assert_match expected_link.squish, email.body.to_s

    visit "/password_reset/#{account.password_reset_token}"

    fill_in 'password', with: 'my_new_password'
    click_on 'Change password'

    assert_text 'Log in'
    account.reload
    assert_nil account.password_reset_token
    fill_in 'email', with: account.email
    fill_in 'password', with: 'my_new_password'
    click_on 'Login'

    assert_text 'Dashboard'
  end
end
