# frozen_string_literal: true

class CreateAccounts < ActiveRecord::Migration[6.0]
  def change
    create_table :accounts, id: :uuid do |t|
      t.string :username, null: false
      t.string :email, null: false
      t.string :password_digest, null: false
    end
    add_index :accounts, :email, unique: true
  end
end
