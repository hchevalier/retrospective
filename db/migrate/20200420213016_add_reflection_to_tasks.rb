# frozen_string_literal: true

class AddReflectionToTasks < ActiveRecord::Migration[6.0]
  def change
    add_column :tasks, :reflection_id, :uuid, null: false
  end
end
