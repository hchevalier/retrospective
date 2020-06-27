class GroupAccess < ApplicationRecord
  belongs_to :account
  belongs_to :group

  scope :active, -> { where(deleted_at: nil) }

  validates :account, uniqueness: { scope: :group, constraint: -> { active } }

  private

  def no_duplicate_active_access
    return if GroupAccess.where.not(id: id).where(account: account, group: group).none?

    errors.add(:account, "This account already has an active access to group #{group.name}")
  end
end
