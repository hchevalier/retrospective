class Builders::Starfish
  class << self
    def zones_typology
      :open
    end

    def build(retrospective)
      retrospective.zones.build(identifier: 'Keep')
      retrospective.zones.build(identifier: 'Start')
      retrospective.zones.build(identifier: 'Stop')
      retrospective.zones.build(identifier: 'More')
      retrospective.zones.build(identifier: 'Less')
    end
  end
end
