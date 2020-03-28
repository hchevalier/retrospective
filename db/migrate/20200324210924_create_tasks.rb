class CreateTasks < ActiveRecord::Migration[6.0]
  def up
    execute <<-SQL
      CREATE TYPE task_statuses AS ENUM ('todo', 'stuck', 'done');
    SQL

    create_table :tasks do |t|
      t.uuid :author_id, null: false
      t.uuid :assignee_id, null: false
      t.text :title, null: false
      t.text :description, null: true
    end

    add_column :tasks, :status, :task_statuses, null: false, default: :todo
  end

  def down
    drop_table :tasks
    execute <<-SQL
      DROP TYPE task_statuses;
    SQL
  end
end
