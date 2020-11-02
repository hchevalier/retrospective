class Account < ApplicationRecord
  has_many :participants
  has_many :pending_invitations
  has_many :retrospectives, through: :participants
  has_many :group_accesses
  has_many :groups, through: :group_accesses
  has_many :accessible_groups, -> { where(group_accesses: { revoked_at: nil }) }, through: :group_accesses, class_name: 'Group', source: :group
  has_many :assigned_tasks, class_name: 'Task', foreign_key: :assignee_id, primary_key: :public_id, inverse_of: :assignee

  has_secure_password
  has_secure_token :password_reset_token

  store :avatar, accessors: [
    :skin, :graphics, :hair_color, :facial_hair, :facial_hair_color, :eyes, :eyebrows, :mouth, :top, :clothe, :clothe_color, :accessories
  ], coder: JSON, prefix: true

  validates :email, uniqueness: true

  before_create :clear_password_reset_token
  before_create :generate_public_id

  def as_json
    {
      id: id,
      publicId: public_id,
      username: username
    }
  end

  def json_avatar
    {
      topType: avatar_top || 'LongHairMiaWallace',
      accessoriesType: avatar_accessories || 'Blank',
      hairColor: avatar_hair_color || 'BrownDark',
      facialHairType: avatar_facial_hair || 'Blank',
      facialHairColor: avatar_facial_hair_color || 'Auburn',
      clotheType: avatar_clothe || 'GraphicShirt',
      clotheColor: avatar_clothe_color || 'PastelBlue',
      graphicType: avatar_graphics || 'Diamond',
      eyeType: avatar_eyes || 'Happy',
      eyebrowType: avatar_eyebrows || 'Default',
      mouthType: avatar_mouth || 'Smile',
      skinColor: avatar_skin || 'Light'
    }
  end

  def as_public_json
    {
      publicId: public_id,
      username: username,
      avatar: json_avatar
    }
  end

  def visible_tasks_from_group(group)
    accesses_to_group = group_accesses.where(group_id: group.id).to_a

    return [] unless accesses_to_group.any?(&:active?)

    group.tasks.select do |task|
      task.pending? ||
      accesses_to_group.any? { |access| access.range.cover?(task.created_at) || access.range.cover?(task.updated_at) }
    end
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

  def generate_public_id
    self.public_id = SecureRandom.uuid
  end
end
