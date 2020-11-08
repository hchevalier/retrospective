# frozen_string_literal: true

class Builders::OscarsGerards
  class << self
    def zones_typology
      :limited
    end

    def build(retrospective)
      retrospective.add_zone('Best ticket', hint: 'What would be the best ticket of the sprint?')
      retrospective.add_zone('Worst ticket', hint: 'What would be the worst ticket of the sprint?')
      retrospective.add_zone('Best learning', hint: 'What would be most important thing you learned during the sprint?')
      retrospective.add_zone('Best event', hint: 'What would be the best event that occured during the sprint?')
      retrospective.add_zone('Worst event', hint: 'What would be the worst event that occured during the sprint?')
      retrospective.add_zone('Best person', hint: 'Who would be the most impactful or helpful person of the sprint?')
      retrospective.add_zone('Best quote', hint: 'What would be the best quote of the sprint?')
      retrospective.add_zone('Worst quote', hint: 'What would be the worst quote of the sprint?')
      retrospective.add_zone('Greatest expectation', hint: 'What do you expect the most from next sprint?')
      retrospective.add_zone('Greatest fear', hint: 'What do you fear the most regarding next sprint?')
    end
  end
end
