class RenameOrganizerIntoFacilitator < ActiveRecord::Migration[6.0]
  def change
    rename_column :retrospectives, :organizer_id, :facilitator_id
  end
end
