class Retrospective < ApplicationRecord
  has_many :participants
  has_one :organizer, -> { order(:created_at).first }, through: :participants, class_name: 'Participant', source: :retrospective
end

# r = Retrospective.create(name: 'Toto & Tata', kind: 'starfish', participants: [Participant.build(surname: 'Toto', email: 'toto@doctolib.com')])
# r.participants << Participant.create(surname: 'Toto', email: 'toto@doctolib.com')
# r.participants << Participant.create(surname: 'Tata', email: 'tata@doctolib.com')

