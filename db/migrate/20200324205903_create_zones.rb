# frozen_string_literal: true

class CreateZones < ActiveRecord::Migration[6.0]
  def change
    create_table :zones do |t|
      t.string :identifier, null: false
      t.uuid :retrospective_id, null: false
      t.timestamps
    end

    add_index :zones, :retrospective_id
  end
end
