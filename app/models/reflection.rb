class Reflection < ApplicationRecord
  belongs_to :zone, inverse_of: :reflections
  belongs_to :owner, class_name: 'Participant', inverse_of: :reflections
  has_one :retrospective, through: :zone
  has_many :reactions, as: :target, inverse_of: :target
  has_many :votes, -> () { vote }, class_name: 'Reaction', foreign_key: :target_id

  def anonymous
    {
      id: id,
      zone: zone.as_json,
      color: owner.color
    }
  end

  def readable
    anonymous.merge(
      content: content,
      owner: owner.profile
    )
  end
end
