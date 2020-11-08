# frozen_string_literal: true

class Builders::PlusMinusInteresting
  class << self
    def zones_typology
      :open
    end

    def build(retrospective)
      retrospective.add_zone('Plus', hint: 'What was positive during the sprint?')
      retrospective.add_zone('Minus', hint: 'What was negative during the sprint?')
      retrospective.add_zone('Interesting', hint: 'What points of interest would you want to direct your attention to?')
    end
  end
end
