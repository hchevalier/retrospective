class Reflection < ApplicationRecord
  belongs_to :zone
  belongs_to :owner, class_name: 'Participant'

  def anonymous
    {
      id: id,
      zone: zone.as_json
    }
  end

  def readable
    anonymous.merge(
      content: content,
      owner: owner.profile
    )
  end
end
