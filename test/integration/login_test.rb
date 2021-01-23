# frozen_string_literal: true

require 'test_helper'

class LoginTest < ActionDispatch::IntegrationTest
  setup do
    ApplicationController.any_instance.stubs(:google_authentication_enabled?).returns(true)
  end

  test 'logs in successfully' do
    account = create(:account, email: 'myemail@company.com', password: 'mypassword')

    visit '/'
    assert_text 'Log in'
    fill_in 'email', with: 'myemail@company.com'
    fill_in 'password', with: 'mypassword'
    click_on 'Login'

    assert_text 'My actions'
  end

  test 'logs in successfully with an email including uppercase characters' do
    account = create(:account, email: 'myemail@company.com', password: 'mypassword')

    visit '/'
    assert_text 'Log in'
    fill_in 'email', with: 'MyEmail@Company.com'
    fill_in 'password', with: 'mypassword'
    click_on 'Login'

    assert_text 'My actions'
  end

  test 'cannot log in with an incorrect password' do
    account = create(:account, email: 'myemail@company.com', password: 'mypassword')

    visit '/'
    assert_text 'Log in'
    fill_in 'email', with: 'myemail@company.com'
    fill_in 'password', with: 'notmypassword'
    accept_confirm do
      click_on 'Login'
    end

    refute_text 'My actions'
    assert_text 'Log in'
  end

  test 'can create a new account with an email including uppercase characters' do
    visit '/'
    assert_text 'Log in'
    click_on "Don't have an account yet?"

    assert_difference 'Account.count' do
      fill_in 'email', with: 'MyEmail@Company.com'
      fill_in 'password', with: 'mypassword'
      fill_in 'username', with: 'Username'
      click_on 'Create account'
      assert_text 'My actions'
    end

    assert_equal 'myemail@company.com', Account.last.email
  end

  test 'can create a new account with Google' do
    visit '/'
    assert_text 'Log in'

    ApplicationController.stub_const(:AUTHORIZED_DOMAINS, ['@notmycompany.com']) do
      find('#google-authentication').click

      refute_text 'My actions'
      assert_text 'Log in'
    end

    ApplicationController.stub_const(:AUTHORIZED_DOMAINS, ['@company.com']) do
      find('#google-authentication').click

      assert_text 'My actions'
      assert_equal 'myemail@company.com', Account.last.email
      assert_equal 'account', Account.last.username
    end
  end

  test 'can authenticate to an existing account with Google' do
    account = create(:account, email: 'myemail@company.com', password: 'mypassword')

    visit '/'
    assert_text 'Log in'

    ApplicationController.stub_const(:AUTHORIZED_DOMAINS, ['@notmycompany.com']) do
      find('#google-authentication').click

      refute_text 'My actions'
      assert_text 'Log in'
    end

    ApplicationController.stub_const(:AUTHORIZED_DOMAINS, ['@company.com']) do
      find('#google-authentication').click

      assert_text 'My actions'
    end
  end
end
