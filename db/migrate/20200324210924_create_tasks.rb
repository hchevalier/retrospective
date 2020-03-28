class CreateTasks < ActiveRecord::Migration[6.0]
  def change
    create_table :tasks do |t|
      t.uuid :author_id, null: false
      t.uuid :assignee_id, null: false
      t.text :title, null: false
      t.text :description, null: true
      t.string :status, null: false, default: :todo
    end
  end
end
