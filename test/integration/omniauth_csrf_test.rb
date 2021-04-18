# frozen_string_literal: true

require 'test_helper'

class OmniauthCsrfTest < ActionDispatch::IntegrationTest
  setup do
    @allow_forgery_protection = ActionController::Base.allow_forgery_protection
    @omni_auth_test_mode = OmniAuth.config.test_mode
    @omni_auth_on_failure = OmniAuth.config.on_failure

    ActionController::Base.allow_forgery_protection = true
    OmniAuth.config.test_mode = false
    OmniAuth.config.on_failure = proc { raise "Omniauth failure" }
  end

  teardown do
    ActionController::Base.allow_forgery_protection = @allow_forgery_protection
    OmniAuth.config.test_mode = @omni_auth_test_mode
    OmniAuth.config.on_failure = @omni_auth_on_failure
  end

  test 'should not accept GET requests to OmniAuth endpoint' do
    visit '/auth/google_oauth2'
    assert_text 'Log in'
  end

  test 'should not accept POST requests with invalid CSRF tokens to OmniAuth endpoint' do
    assert_raises('Omniauth failure') do
      post '/auth/google_oauth2', headers: { 'action_dispatch.show_exceptions': false }
    end
  end
end
