# frozen_string_literal: true

class AddOptionsToRetrospectives < ActiveRecord::Migration[6.1]
  def change
    add_column :retrospectives, :options, :jsonb, default: {}
  end
end
