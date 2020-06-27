class Group < ApplicationRecord
  has_many :group_accesses
  has_many :accounts, through: :group_accesses
  has_many :accounts_without_revoked, -> { where(group_accesses: { revoked_at: nil }) }, through: :group_accesses, class_name: 'Account', source: :account
  has_many :retrospectives

  def pending_tasks
    retrospectives.includes(tasks: %i(assignee author reflection)).where(tasks: { status: :todo }).flat_map(&:tasks)
  end

  def as_json
    {
      createdAt: created_at,
      id: id,
      members: accounts_without_revoked.as_json,
      name: name,
      pendingTasks: pending_tasks.as_json
    }
  end
end
