# frozen_string_literal: true

class Builders::Sailboat
  class << self
    def zones_typology
      :open
    end

    def build(retrospective)
      retrospective.zones.build(identifier: 'Wind')
      retrospective.zones.build(identifier: 'Anchor')
      retrospective.zones.build(identifier: 'Rocks')
      retrospective.zones.build(identifier: 'Island')
    end
  end
end
