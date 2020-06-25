class Group < ApplicationRecord
  has_many :group_accesses
  has_many :accounts, through: :group_accesses
  has_many :accounts_without_revoked, -> { where(group_accesses: { revoked_at: nil }) }, through: :group_accesses, class_name: 'Account', source: :account

  def pending_tasks
    participant_ids = accounts_without_revoked.joins(:participants).flat_map { |account| account.participants.ids }

    Task
      .includes(:assignee, :author, :reflection)
      .where(status: :todo, assignee: participant_ids)
  end

  def as_json
    {
      id: id,
      name: name,
      pendingTasks: pending_tasks.as_json
    }
  end
end
