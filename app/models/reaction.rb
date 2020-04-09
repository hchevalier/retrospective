class Reaction < ApplicationRecord
  belongs_to :target, polymorphic: true
  belongs_to :author, class_name: 'Participant'

  validate :max_five_votes_per_author_and_retrospective

  enum kind: {
    vote: 'vote',
    emoji: 'emoji',
  }

  def readable
    {
      id: id,
      targetId: "#{target_type}-#{target_id}",
      kind: kind,
      content: content
    }
  end

  private

  def max_five_votes_per_author_and_retrospective
    retrospective_id =
      case target.class.name
      when 'Reflection'
        target.zone.retrospective_id
      else
        raise "Don't know how to access a Retrospective from target"
      end

    return unless Retrospective.joins(:reactions).where(id: retrospective_id, reactions: { kind: 'vote', author_id: author_id }).count >= 5

    errors.add(:author, "can't vote more than 5 times per retrospective")
  end
end
