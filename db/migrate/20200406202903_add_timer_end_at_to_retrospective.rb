class AddTimerEndAtToRetrospective < ActiveRecord::Migration[6.0]
  def change
    add_column :retrospectives, :timer_end_at, :timestamp
  end
end
