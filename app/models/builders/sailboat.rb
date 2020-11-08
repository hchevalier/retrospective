# frozen_string_literal: true

class Builders::Sailboat
  class << self
    def zones_typology
      :open
    end

    def build(retrospective)
      retrospective.add_zone('Wind')
      retrospective.add_zone('Anchor')
      retrospective.add_zone('Rocks')
      retrospective.add_zone('Island')
    end
  end
end
