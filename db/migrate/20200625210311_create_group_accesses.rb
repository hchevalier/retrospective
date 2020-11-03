# frozen_string_literal: true

class CreateGroupAccesses < ActiveRecord::Migration[6.0]
  def change
    create_table :group_accesses do |t|
      t.uuid :group_id, null: false
      t.uuid :account_id, null: false
      t.datetime :revoked_at
      t.timestamps
    end

    add_index :group_accesses, [:group_id, :account_id]
    add_index :group_accesses, [:group_id, :account_id], unique: true, where: 'revoked_at IS NULL', name: 'current_access_to_group_for_account'
  end
end
