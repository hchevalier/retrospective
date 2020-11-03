# frozen_string_literal: true

class AddPublicIdToAccount < ActiveRecord::Migration[6.0]
  def up
    add_column :accounts, :public_id, :uuid
    Account.connection.schema_cache.clear!
    Account.reset_column_information
    Account.transaction do
      Account.all.each { |account| account.update!(public_id: SecureRandom.uuid) }
      Task.all.each do |task|
        participant = Participant.find_by(id: task.assignee_id)
        next unless participant

        task.update!(assignee_id: participant.account.public_id)
      end
    end
    change_column_null :accounts, :public_id, false
  end

  def down
    Task.all.each do |task|
      participant =
        task.retrospective&.participants&.find { |participant| participant.account.public_id == task.assignee_id }
      next unless participant

      task.update_column(:assignee_id, participant.id)
    end
    remove_column :accounts, :public_id
  end
end
