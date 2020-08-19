class AddHintToZones < ActiveRecord::Migration[6.0]
  def change
    add_column :zones, :hint, :text, null: true
  end
end
