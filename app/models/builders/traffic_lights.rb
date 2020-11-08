# frozen_string_literal: true

class Builders::TrafficLights
  class << self
    def zones_typology
      :single_choice
    end

    def build(retrospective)
      retrospective.add_zone('Support', hint: 'We always get support and help when we ask for it')
      retrospective.add_zone('Team work', hint: 'We are a strong team and collaborate well together')
      retrospective.add_zone('Mission', hint: 'We know why we are here, are aligned with it and excited about it')
      retrospective.add_zone(
        'Codebase',
        hint: 'We are proud of the quality of our code. It is clean, easy to read and has sufficient test coverage'
      )
      retrospective.add_zone('Process', hint: 'Our way of working fits us perfectly')
      retrospective.add_zone('Value', hint: 'We are proud of what we deliver and our end users feel the same')
      retrospective.add_zone('Learning', hint: 'We are learning interesting stuff all the time')
      retrospective.add_zone(
        'Ticket flow',
        hint: 'We get stuff done without useless waiting or delays. Releasing is simple, safe and painless'
      )
      retrospective.add_zone('Fun', hint: 'We love going to work and have great fun working together')
      retrospective.add_zone('Influence', hint: <<~TEXT.squish)
        We are in control of our roadmap, we can intervene in decision process regarding what
        to build and how to build it
      TEXT
    end

    def autovote!(retrospective)
      reflections = sorted_reflections(retrospective)

      count = reflections.count
      votes = []
      now = Time.current
      reflections.each do |reflection|
        count.times do
          votes << reflection.votes.new(
            author: retrospective.facilitator,
            target: reflection,
            content: Reaction::VOTE_EMOJI,
            retrospective: retrospective,
            created_at: now,
            updated_at: now
          )
        end
        count -= 1
      end
      Reaction.insert_all!(votes.map(&:attributes).map(&:compact)) # rubocop:disable Rails/SkipsModelValidations
    end

    def sorted_reflections(retrospective)
      retrospective
        .reflections
        .revealed
        .to_a
        .group_by(&:zone_id)
        .sort_by do |_zone, reflections|
          [
            -reflections.count { |r| r.content == 'red' },
            -reflections.count { |r| r.content == 'orange' },
            -reflections.count { |r| r.content == 'green' }
          ]
        end
        .lazy
        .map(&:last)
        .map(&:first)
    end
  end
end
