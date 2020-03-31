class Participant < ApplicationRecord
  belongs_to :retrospective
  has_many :reflections, foreign_key: :owner_id
  has_many :reactions, foreign_key: :author_id

  def profile
    {
      uuid: id,
      surname: surname,
      organizer: organizer?
    }
  end

  def organizer?
    retrospective.organizer == self
  end

  def join
    puts "Broacasting that #{surname} (#{id}) joined"
    AppearanceChannel.broadcast_to(retrospective, new_participant: profile)
  end
end
