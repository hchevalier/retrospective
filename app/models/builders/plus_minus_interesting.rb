class Builders::PlusMinusInteresting
  class << self
    def zones_typology
      :open
    end

      def build(retrospective)
      retrospective.zones.build(identifier: 'Plus', hint: 'What was positive during the sprint?')
      retrospective.zones.build(identifier: 'Minus', hint: 'What was negative during the sprint?')
      retrospective.zones.build(identifier: 'Interesting', hint: 'What points of interest would you want to direct your attention to?')
    end
  end
end
