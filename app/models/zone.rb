# frozen_string_literal: true

class Zone < ApplicationRecord
  has_many :reflections, inverse_of: :zone, dependent: :destroy
  belongs_to :retrospective, inverse_of: :zones

  def as_json
    zone = {
      id: id,
      hint: hint,
      name: identifier
    }

    if retrospective.step.in?(%w[actions done])
      typology = retrospective.zones_typology
      zone.merge!(details: reflections.group_by(&:content).transform_values(&:count)) if typology == :single_choice
    end

    zone
  end
end
