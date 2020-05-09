class AddEncryptionKeyToParticipants < ActiveRecord::Migration[6.0]
  def change
    add_column :participants, :encryption_key, :string, null: false
  end
end
