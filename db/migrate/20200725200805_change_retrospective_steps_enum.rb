class ChangeRetrospectiveStepsEnum < ActiveRecord::Migration[6.0]
  disable_ddl_transaction!

  def up
    execute <<-SQL
      ALTER TYPE retrospective_steps
      ADD VALUE 'reviewing'
      AFTER 'gathering'
    SQL
  end

  def down
    execute <<-SQL
      DELETE FROM pg_enum
      WHERE enumlabel = 'reviewing'
      AND enumtypid = (
        SELECT oid FROM pg_type WHERE typname = 'retrospective_steps'
      )
    SQL
  end
end
