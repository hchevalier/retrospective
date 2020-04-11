class AddLoggedInToParticipants < ActiveRecord::Migration[6.0]
  def change
    add_column :participants, :logged_in, :boolean, null: false, default: true
  end
end
