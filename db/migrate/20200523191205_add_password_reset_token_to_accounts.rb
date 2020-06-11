class AddPasswordResetTokenToAccounts < ActiveRecord::Migration[6.0]
  def change
    add_column :accounts, :password_reset_token, :string, null: true
  end
end
