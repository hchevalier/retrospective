# frozen_string_literal: true

class Builders::Daki
  class << self
    def zones_typology
      :open
    end

    def build(retrospective)
      retrospective.zones.build(identifier: 'Drop')
      retrospective.zones.build(identifier: 'Add')
      retrospective.zones.build(identifier: 'Keep')
      retrospective.zones.build(identifier: 'Idea')
    end
  end
end
