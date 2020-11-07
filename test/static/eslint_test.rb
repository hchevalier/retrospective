# frozen_string_literal: true

require 'test_helper'

class EslintTest < ActiveSupport::TestCase
  test 'should have no ESlint error' do
    puts 'Checking for ESlint offenses:'
    output = system %(yarn run eslint app/javascript/**/*.js 2>&1)
    fail('Check failed: ' + output.to_s) if $CHILD_STATUS.exitstatus != 0

    output
  end
end
