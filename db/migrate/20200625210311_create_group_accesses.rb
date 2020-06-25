class CreateGroupAccesses < ActiveRecord::Migration[6.0]
  def change
    create_table :group_accesses do |t|
      t.uuid :group_id, null: false
      t.uuid :account_id, null: false
      t.datetime :revoked_at
    end
    add_index :group_accesses, [:group_id, :account_id]
  end
end
