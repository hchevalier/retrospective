# frozen_string_literal: true

require 'test_helper'

class TaskTest < ActiveSupport::TestCase
  test 'task description is not readable in production consoles' do
    task = Task.new(description: 'My secret task')
    assert_equal 'My secret task', task.description

    ApplicationRecord.any_instance.stubs(:requires_anonymization?).returns(true)
    assert_equal '**************', task.description
  end
end
