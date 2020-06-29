class Account < ApplicationRecord
  has_many :participants
  has_many :retrospectives, through: :participants
  has_many :group_accesses
  has_many :groups, through: :group_accesses
  has_many :accessible_groups, -> { where(group_accesses: { revoked_at: nil }) }, through: :group_accesses, class_name: 'Group', source: :group

  has_secure_password
  has_secure_token :password_reset_token

  validates :email, uniqueness: true

  before_create :clear_password_reset_token

  def as_json
    {
      id: id,
      username: username
    }
  end

  def sees_task?(task)
    accesses_to_group = group_accesses.where(group_id: task.retrospective.group_id).to_a

    retrospectives.ids.include?(task.retrospective.id) ||
      accesses_to_group.filter(&:active?).present? && (
        task.todo? ||
        accesses_to_group.any? { |access| access.range.cover?(task.created_at) || access.range.cover?(task.updated_at) }
      )
  end

  def self.from_omniauth(auth)
    where(email: auth.info.email).first_or_initialize do |account|
      account.username = auth.info.name
      account.email = auth.info.email
      account.password = SecureRandom.hex
    end
  end

  def clear_password_reset_token
    self.password_reset_token = nil
  end
end
