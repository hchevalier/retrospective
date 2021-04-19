# frozen_string_literal: true

class Builders::Timeline
  class << self
    def zones_typology
      :open
    end

    def build(retrospective)
      # This uses UTC as application does not have a timezone set
      weeks_ago = (retrospective.options['weeks_displayed'] || 2).to_i.weeks.ago
      (weeks_ago.beginning_of_week.to_date..Time.zone.today).each do |date|
        next if date.on_weekend?

        retrospective.add_zone(date.strftime('%d/%m'))
      end
    end
  end
end
