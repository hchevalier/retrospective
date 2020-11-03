# frozen_string_literal: true

class AddRevealerIdToRetrospectives < ActiveRecord::Migration[6.0]
  def change
    add_column :retrospectives, :revealer_id, :uuid
  end
end
