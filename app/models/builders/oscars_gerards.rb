class Builders::OscarsGerards
  class << self
    def zones_typology
      :limited
    end

      def build(retrospective)
      retrospective.zones.build(identifier: 'Best ticket', hint: 'What would be the best ticket of the sprint?')
      retrospective.zones.build(identifier: 'Worst ticket', hint: 'What would be the worst ticket of the sprint?')
      retrospective.zones.build(identifier: 'Best learning', hint: 'What would be most important thing you learned during the sprint?')
      retrospective.zones.build(identifier: 'Best event', hint: 'What would be the best event occuring during the sprint?')
      retrospective.zones.build(identifier: 'Worst event', hint: 'What would be the worst event occuring during the sprint?')
      retrospective.zones.build(identifier: 'Best person', hint: 'Who would be the most impactful or helpful person of the sprint?')
      retrospective.zones.build(identifier: 'Best quote', hint: 'What would be the best quote of the sprint?')
      retrospective.zones.build(identifier: 'Worst quote', hint: 'What would be the worst quote of the sprint?')
    end
  end
end
