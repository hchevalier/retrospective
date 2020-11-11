# frozen_string_literal: true

class Builders::FourL
  class << self
    def zones_typology
      :open
    end

    def build(retrospective)
      retrospective.zones.build(identifier: 'Liked', hint: 'What did you like during the previous sprint?')
      retrospective.zones.build(
        identifier: 'Learned',
        hint: 'What did you learn or discover during the previous sprint?'
      )
      retrospective.zones.build(identifier: 'Lacked', hint: <<~TEXT.squish)
        What factually missed from the previous sprint and would have eased your life, though would not be
        useful anymore?
      TEXT
      retrospective.zones.build(identifier: 'Longed for', hint: <<~TEXT.squish)
        What do you wish you had during the previous sprint that would still be an interesting thing to have for
        the next one?
      TEXT
    end
  end
end
