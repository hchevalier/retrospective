class GroupAccess < ApplicationRecord
  belongs_to :account
  belongs_to :group

  scope :active, -> { where(revoked_at: nil) }

  validates :account, uniqueness: { scope: :group, constraint: -> { active } }

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
        createdAt: group.created_at,
        id: group.id,
        membersCount: group.accounts_without_revoked.count,
        name: group.name
      }
    }
  end

  private

  def no_duplicate_active_access
    return if GroupAccess.where.not(id: id).where(account: account, group: group).none?

    errors.add(:account, "This account already has an active access to group #{group.name}")
  end
end
