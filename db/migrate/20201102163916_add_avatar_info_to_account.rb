class AddAvatarInfoToAccount < ActiveRecord::Migration[6.0]
  def change
    add_column :accounts, :avatar, :jsonb
  end
end
