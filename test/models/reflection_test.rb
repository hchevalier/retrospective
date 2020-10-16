# frozen_string_literal: true

require 'test_helper'

class ReflectionTest < ActiveSupport::TestCase
  test 'reflection content is not readable in production consoles' do
    reflection = Reflection.new(content: 'My secret reflection')
    assert_equal 'My secret reflection', reflection.content

    ApplicationRecord.any_instance.stubs(:requires_anonymization?).returns(true)
    assert_equal '********************', reflection.content
  end
end
