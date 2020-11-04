# frozen_string_literal: true

class Group < ApplicationRecord
  has_many :group_accesses, dependent: :destroy
  has_many :pending_invitations, dependent: :destroy
  has_many :accounts, through: :group_accesses
  has_many :accounts_without_revoked,
    -> { where(group_accesses: { revoked_at: nil }) },
    through: :group_accesses,
    class_name: 'Account',
    source: :account
  has_many :retrospectives, dependent: :destroy
  has_many :tasks, through: :retrospectives
  has_many :pending_tasks, through: :retrospectives

  def accessible_by?(account)
    group_accesses.exists?(revoked_at: nil, account: account)
  end

  def add_member(account)
    accounts << account unless accessible_by?(account)
  end

  def as_short_json
    {
      createdAt: created_at,
      id: id,
      name: name,
      nextRetrospective: next_retrospective
    }
  end

  def as_json(account)
    {
      **as_short_json,
      members: accounts_without_revoked.map(&:as_public_json),
      pendingInvitations: pending_invitations.as_json,
      tasks: account.visible_tasks_from_group(self).as_json
    }
  end
end
