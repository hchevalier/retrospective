class Zone < ApplicationRecord
  has_many :reflections, inverse_of: :zone
  belongs_to :retrospective, inverse_of: :zones

  def as_json
    {
      id: id,
      name: identifier,
    }
  end
end
