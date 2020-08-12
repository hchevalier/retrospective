class Builders::GladSadMad
  class << self
    def zones_typology
      :open
    end

      def build(retrospective)
      retrospective.zones.build(identifier: 'Glad')
      retrospective.zones.build(identifier: 'Sad')
      retrospective.zones.build(identifier: 'Mad')
    end
  end
end
