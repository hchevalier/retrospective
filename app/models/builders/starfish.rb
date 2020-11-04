# frozen_string_literal: true

class Builders::Starfish
  class << self
    def zones_typology
      :open
    end

    def build(retrospective)
      retrospective.add_zone('Keep')
      retrospective.add_zone('Start')
      retrospective.add_zone('Stop')
      retrospective.add_zone('More')
      retrospective.add_zone('Less')
    end
  end
end
