ENV['RAILS_ENV'] ||= 'test'
require_relative '../config/environment'
require 'rails/test_help'
require 'mocha/minitest'
require 'capybara/rails'
require 'capybara/minitest'
require 'test_utils/cookies_helpers'
require 'test_utils/assert_helpers'
require 'test_utils/cable_helpers'

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

  include CookiesHelpers
  include AssertHelpers
  include CableHelpers

  def headless?
    Capybara.current_driver.match? /headless/
  end

  Capybara.register_driver :selenium_chrome_headless do |app|
    browser_options = ::Selenium::WebDriver::Chrome::Options.new.tap do |opts|
      opts.args << '--headless'
      opts.args << '--disable-gpu' if Gem.win_platform?
      opts.args << '--disable-site-isolation-trials'
      opts.args << '--window-size=1024,768'
    end
    Capybara::Selenium::Driver.new(app, browser: :chrome, options: browser_options)
  end
  Capybara.javascript_driver = :selenium_chrome_headless

  Capybara.server = :puma, { Silent: true }
  Capybara.default_driver = ENV.fetch('HEADLESS', false) == 'true' ? :selenium_chrome_headless : :selenium_chrome
  Capybara.default_max_wait_time = 5.seconds

  # Reset sessions and driver between tests
  teardown do
    Capybara.reset_sessions!
    Capybara.use_default_driver
  end

  def next_step
    click_on 'Next step'
    click_on 'Confirm'
  end

  def visit(path)
    @account.reload if @account
    super
  end
end
