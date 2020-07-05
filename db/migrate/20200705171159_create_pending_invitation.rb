class CreatePendingInvitation < ActiveRecord::Migration[6.0]
  def change
    create_table :pending_invitations, id: :uuid do |t|
      t.uuid :group_id, null: false
      t.uuid :account_id, null: false
      t.uuid :retrospective_id
      t.string :email, null: false
      t.timestamps
    end
    add_index :pending_invitations, :group_id
  end
end
