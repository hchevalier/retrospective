class Builders::TrafficLights
  class << self
    def zones_typology
      :single_choice
    end

    def build(retrospective)
      retrospective.zones.build(identifier: 'Support')
      retrospective.zones.build(identifier: 'Team work')
      retrospective.zones.build(identifier: 'Mission')
      retrospective.zones.build(identifier: 'Codebase')
      retrospective.zones.build(identifier: 'Process')
      retrospective.zones.build(identifier: 'Value')
      retrospective.zones.build(identifier: 'Learning')
      retrospective.zones.build(identifier: 'Ticket flow')
      retrospective.zones.build(identifier: 'Fun')
      retrospective.zones.build(identifier: 'Influence')
    end
  end
end
