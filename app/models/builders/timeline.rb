# frozen_string_literal: true

class Builders::Timeline
  class << self
    def zones_typology
      :open
    end

    def build(retrospective)
      (2.weeks.ago.beginning_of_week.to_date..Date.today).each do |date|
        retrospective.add_zone(date.strftime('%d/%m'))
      end
    end
  end
end
