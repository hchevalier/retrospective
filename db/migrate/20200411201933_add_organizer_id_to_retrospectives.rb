class AddOrganizerIdToRetrospectives < ActiveRecord::Migration[6.0]
  def change
    add_column :retrospectives, :organizer_id, :uuid, null: false
  end
end
