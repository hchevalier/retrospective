class Reflection < ApplicationRecord
  belongs_to :zone, inverse_of: :reflections
  belongs_to :topic, optional: true, inverse_of: :reflections
  belongs_to :owner, class_name: 'Participant', inverse_of: :reflections
  has_one :retrospective, through: :zone
  has_many :reactions, as: :target, inverse_of: :target
  has_many :votes, -> () { vote }, class_name: 'Reaction', foreign_key: :target_id
  has_many :tasks

  scope :revealed, -> { where(revealed: true) }

  def content
    anonymize(super)
  end

  def anonymous
    {
      id: id,
      topic: topic&.as_json,
      zone: zone.as_json,
      color: owner.color,
      revealed: revealed,
      updatedAt: updated_at
    }
  end

  def readable
    anonymous.merge(
      content: content,
      owner: owner.short_profile
    )
  end
end
