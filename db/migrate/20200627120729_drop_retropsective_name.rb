class DropRetropsectiveName < ActiveRecord::Migration[6.0]
  def change
    remove_column :retrospectives, :name, :string, null: false
  end
end
