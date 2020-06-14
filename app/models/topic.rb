class Topic < ApplicationRecord
  has_many :reflections

  before_save :update_name

  def as_json
    {
      name: name,
      reflections: reflections.map(&:readable)
    }
  end

  private

  def update_name
    # TODO: only update name if it was not set manually
    # TODO: get main word(s) for each reflection
    self.name = reflections.first.name.split(' ').first
  end
end
