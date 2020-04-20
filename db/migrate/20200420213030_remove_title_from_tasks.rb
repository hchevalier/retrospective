class RemoveTitleFromTasks < ActiveRecord::Migration[6.0]
  def change
    remove_column :tasks, :title, :string, null: false
  end
end
