# frozen_string_literal: true

require 'test_helper'

class RubocopTest < ActiveSupport::TestCase
  test 'should have no rubocop error' do
    Rails.logger.info('Checking for Rubocop offenses:')
    output = system %(rubocop --cache false --config .rubocop.yml 2>&1)
    fail('Check failed: ' + output.to_s) if $CHILD_STATUS.exitstatus != 0

    output
  end
end
