class Group < ApplicationRecord
  has_many :group_accesses
  has_many :pending_invitations
  has_many :accounts, through: :group_accesses
  has_many :accounts_without_revoked, -> { where(group_accesses: { revoked_at: nil }) }, through: :group_accesses, class_name: 'Account', source: :account
  has_many :retrospectives

  def accessible_by?(account)
    group_accesses.where(revoked_at: nil, account: account).exists?
  end

  def tasks_visible_by(account)
    retrospectives
      .includes(tasks: %i(assignee author reflection))
      .flat_map(&:tasks)
      .filter { |task| account.sees_task?(task) }
  end

  def as_short_json
    {
      createdAt: created_at,
      id: id,
      name: name
    }
  end

  def as_json(account)
    {
      **as_short_json,
      members: accounts_without_revoked.as_json,
      tasks: tasks_visible_by(account).as_json
    }
  end
end