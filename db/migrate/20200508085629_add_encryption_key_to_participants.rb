# frozen_string_literal: true

class AddEncryptionKeyToParticipants < ActiveRecord::Migration[6.0]
  def up
    add_column :participants, :encryption_key, :string, null: true
    clear_cache!
    Participant.where(encryption_key: nil).each do |participant|
      participant.update_column(:encryption_key, (0...32).map { ('a'..'z').to_a[rand(26)] }.join)
    end
    change_column_null :participants, :encryption_key, false
  end

  def down
    remove_column :participants, :encryption_key
  end
end
