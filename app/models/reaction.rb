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

  VOTE_EMOJI = '👍'
  UNVOTE_EMOJI = '👎'
  MAX_VOTES = 5

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
    return unless vote?

    retrospective_id =
      case target.class.name
      when 'Reflection'
        target.zone.retrospective_id
      when 'Topic'
        target.retrospective_id
      else
        raise "Don't know how to access a Retrospective from target"
      end

    votes_count = author.reactions.vote.count
    return unless votes_count >= Reaction::MAX_VOTES

    errors.add(:author, "can't vote more than #{Reaction::MAX_VOTES} times per retrospective")
  end
end
