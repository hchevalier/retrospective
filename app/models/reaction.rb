class Reaction < ApplicationRecord
  belongs_to :target, polymorphic: true
  belongs_to :author, class_name: 'Participant'

  before_save :ensure_vote_content

  validate :max_five_votes_per_author_and_retrospective
  validate :valid_emoji

  enum kind: {
    vote: 'vote',
    emoji: 'emoji',
  }

  VOTE_EMOJI = '✋'

  EMOJI_LIST = {
    joy: '😂',
    sweat_smile: '😅',
    star_struck:'🤩',
    hugging_face: '🤗',
    exploding_head: '🤯',
    rage: '😡',
    thinking_face: '🤔',
    pray: '🙏',
    clap: '👏',
    muscle: '💪',
    fingers_crossed: '🤞',
    rocket: '🚀',
    fire: '🔥'
  }

  def readable
    {
      id: id,
      authorId: author_id,
      targetId: "#{target_type}-#{target_id}",
      kind: kind,
      content: content
    }
  end

  private

  def ensure_vote_content
    self.content = :vote if vote?
  end

  def valid_emoji
    return if vote? || EMOJI_LIST.fetch(content.to_sym, nil)

    errors.add(:content, 'is not an accepted emoji')
  end

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
