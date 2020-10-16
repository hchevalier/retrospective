# frozen_string_literal: true

source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '2.7.1'

gem 'rails', '6.0.3.4'

gem 'bcrypt'
gem 'bootsnap', '>= 1.4.2', require: false
gem 'figaro'
gem 'jbuilder', '~> 2.7'
gem 'omniauth'
gem 'omniauth-google-oauth2'
gem 'pg'
gem 'puma', '~> 4.1'
gem 'react-rails'
gem 'redis', '~> 4.2'
gem 'sass-rails', '>= 6'
gem 'sidekiq'
gem 'turbolinks', '~> 5'
gem 'webpacker', '~> 4.0'

group :development do
  gem 'bullet'
  gem 'listen', '>= 3.0.5', '< 3.2'
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'
  gem 'web-console', '>= 3.3.0'
end

group :test do
  gem 'capybara', '>= 2.15'
  gem 'minitest-stub-const'
  gem 'mocha'
  gem 'selenium-webdriver'
  gem 'webdrivers'
end

group :development, :test do
  gem 'factory_bot_rails'
  gem 'pry'
  gem 'pry-byebug'
  gem 'rubocop-rails', require: false
end
