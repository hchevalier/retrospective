class Group < ApplicationRecord
  has_many :group_accesses
  has_many :accounts, through: :group_accesses
  has_many :accounts_without_revoked, -> { where(group_accesses: { revoked_at: nil }) }, through: :group_accesses, class_name: 'Account', source: :account
  has_many :retrospectives

  def pending_tasks
    Task
      .includes(:assignee, :author, :reflection)
      .where(status: :todo, retrospective: retrospectives.ids)
  end

  def as_json
    {
      id: id,
      name: name,
      pendingTasks: pending_tasks.as_json
    }
  end
end
