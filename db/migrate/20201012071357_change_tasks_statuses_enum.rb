# frozen_string_literal: true

class ChangeTasksStatusesEnum < ActiveRecord::Migration[6.0]
  disable_ddl_transaction!

  def up
    execute <<-SQL
      ALTER TYPE task_statuses
      ADD VALUE 'on_hold'
      AFTER 'todo'
    SQL
    execute <<-SQL
      ALTER TYPE task_statuses
      ADD VALUE 'wont_do'
      AFTER 'stuck'
    SQL
    Task.connection.schema_cache.clear!
    Task.reset_column_information
    Task.where(status: :stuck).update_all(status: :wont_do)
    execute <<-SQL
      DELETE FROM pg_enum
      WHERE enumlabel = 'stuck'
      AND enumtypid = (
        SELECT oid FROM pg_type WHERE typname = 'task_statuses'
      )
    SQL
  end

  def down
    raise ActiveRecord::IrreversibleMigration, "No rollback to stuck status for tasks"
  end
end
