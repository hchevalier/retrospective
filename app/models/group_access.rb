class GroupAccess < ApplicationRecord
  belongs_to :account
  belongs_to :group

  scope :active, -> { where(revoked_at: nil) }

  validate :no_duplicate_active_access

  def as_json
    {
      account: {
        id: account.id,
        username: account.username
      },
      active: revoked_at.nil?,
      createdAt: created_at,
      id: id,
      group: {
        **group.as_short_json,
        allTimeRetrospectivesCount: group.retrospectives.count,
        membersCount: group.accounts_without_revoked.count,
        pendingTasksCount: group.pending_tasks.count
      }
    }
  end

  def active?
    revoked_at.nil?
  end

  def range
    created_at...revoked_at
  end

  private

  def no_duplicate_active_access
    return if GroupAccess.where.not(id: id).where(account: account, group: group, revoked_at: nil).none?

    errors.add(:account, "This account already has an active access to group #{group.name}")
  end
end
