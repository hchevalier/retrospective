ENV['RAILS_ENV'] ||= 'test'
require_relative '../config/environment'
require 'rails/test_help'
require 'mocha/minitest'
require 'capybara/rails'
require 'capybara/minitest'
require 'test_utils/material_ui_helpers'
require 'test_utils/factories_helpers'
require 'test_utils/cookies_helpers'
require 'test_utils/assert_helpers'

class ActiveSupport::TestCase
  include FactoryBot::Syntax::Methods
  # Run tests in parallel with specified workers
  parallelize(workers: :number_of_processors) unless ENV['GITHUB_RUN_ID']

  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  fixtures :all

  # Add more helper methods to be used by all tests here...
end

class ActionDispatch::IntegrationTest
  include FactoryBot::Syntax::Methods
  # Make the Capybara DSL available in all integration tests
  include Capybara::DSL
  # Make `assert_*` methods behave like Minitest assertions
  include Capybara::Minitest::Assertions

  include MaterialUiHelpers
  include FactoriesHelpers
  include CookiesHelpers
  include AssertHelpers

  Capybara.server = :puma, { Silent: true }
  Capybara.default_driver = ENV.fetch('HEADLESS', false) == 'true' ? :selenium_chrome_headless : :selenium_chrome
  Capybara.default_max_wait_time = 5.seconds

  # Reset sessions and driver between tests
  teardown do
    Capybara.reset_sessions!
    Capybara.use_default_driver
  end
end
