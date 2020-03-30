class Zone < ApplicationRecord
  has_many :reflections
  belongs_to :retrospective

  def as_json
    {
      id: id,
      name: identifier
    }
  end
end
