class Reflection < ApplicationRecord
  belongs_to :zone
  belongs_to :owner, class_name: 'Participant'
  has_many :reactions, as: :target

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
