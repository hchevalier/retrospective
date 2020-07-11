class Topic < ApplicationRecord
  belongs_to :retrospective
  has_many :reflections, inverse_of: :topic
  has_many :reactions, as: :target, inverse_of: :target
  has_many :votes, -> () { vote }, class_name: 'Reaction', foreign_key: :target_id

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
    reflections_list = reflections.map {|reflection| reflection.content.split(' ')}.flatten
    reflections_occurrences = reflections_list.each_with_object(Hash.new(0)){|string, hash| hash[string] += 1}
    self.label = reflections_occurrences.key(reflections_occurrences.values.max)
  end
end
