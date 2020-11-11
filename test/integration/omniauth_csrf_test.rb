# frozen_string_literal: true

require 'test_helper'

class OmniauthCsrfTest < ActionDispatch::IntegrationTest
  setup do
    OmniAuth.config.test_mode = false
  end

  teardown do
    OmniAuth.config.test_mode = true
  end

  test 'should not accept GET requests to OmniAuth endpoint' do
    visit '/auth/google_oauth2'
    assert_text 'Log in'
  end

  test 'should not accept POST requests with invalid CSRF tokens to OmniAuth endpoint' do
    assert_raises ActionController::InvalidAuthenticityToken do
      post '/auth/google_oauth2'
    end
  end
end
