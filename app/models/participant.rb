class Participant < ApplicationRecord
  belongs_to :retrospective
  has_many :reactions, inverse_of: :author

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
