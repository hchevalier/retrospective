# frozen_string_literal: true

class AddAccountIdToParticipants < ActiveRecord::Migration[6.0]
  def up
    add_column :participants, :account_id, :uuid, null: true
    clear_cache!
    Participant.where(account_id: nil).each do |participant|
      account = Account.find_or_initialize_by(email: participant.email)
      if account.new_record?
        account.username = participant.surname
        account.password = SecureRandom.hex
        account.save!
      end
      participant.update_column(:account_id, account.id)
    end
    change_column_null :participants, :account_id, false
  end

  def down
    remove_column :participants, :account_id
  end
end
