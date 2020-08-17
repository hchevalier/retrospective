class Builders::TrafficLights
  class << self
    def zones_typology
      :single_choice
    end

    def build(retrospective)
      retrospective.zones.build(identifier: 'Support', hint: 'We always get support and help when we ask for it')
      retrospective.zones.build(identifier: 'Team work', hint: 'We are a strong team and collaborate well together')
      retrospective.zones.build(identifier: 'Mission', hint: 'We know why we are here, are aligned with it and excited about it')
      retrospective.zones.build(identifier: 'Codebase', hint: 'We are proud of the quality of our code. It is clean, easy to read and has sufficient test coverage')
      retrospective.zones.build(identifier: 'Process', hint: 'Our way of working fits us perfectly')
      retrospective.zones.build(identifier: 'Value', hint: 'We are proud of what we deliver and our end users feel the same')
      retrospective.zones.build(identifier: 'Learning', hint: 'We are learning interesting stuff all the time')
      retrospective.zones.build(identifier: 'Ticket flow', hint: 'We get stuff done without useless waiting or delays. Releasing is simple, safe and painless')
      retrospective.zones.build(identifier: 'Fun', hint: 'We love going to work and have great fun working together')
      retrospective.zones.build(identifier: 'Influence', hint: 'We are in control of our roadmap, we can intervene in decision process regarding what to build and how to build it')
    end

    def autovote!(retrospective)
      reflections =
        retrospective
          .reflections
          .revealed
          .to_a
          .group_by(&:zone_id)
          .sort_by do |zone, reflections|
            [
              -reflections.count { |r| r.content == 'red' },
              -reflections.count { |r| r.content == 'orange' },
              -reflections.count { |r| r.content == 'green' }
            ]
          end
          .lazy
          .map(&:last)
          .map(&:first)

      count = reflections.count
      reflections.each do |reflection|
        count.times do
          # TODO: do a single commit
          reflection.votes.create!(
            author: retrospective.facilitator,
            target: reflection,
            content: Reaction::VOTE_EMOJI,
            retrospective: retrospective
          )
        end
        count -= 1
      end
    end
  end
end
