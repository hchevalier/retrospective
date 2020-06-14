class Topic < ApplicationRecord
  belongs_to :retrospective
  has_many :reflections, inverse_of: :topic

  before_save :update_label

  def as_json
    {
      id: id,
      label: label
    }
  end

  private

  def update_label
    # TODO: only update label if it was not set manually
    # TODO: get main word(s) for each reflection
    self.label = reflections.first.content.split(' ').first
  end
end
