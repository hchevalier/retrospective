# frozen_string_literal: true

class Retrospective < ApplicationRecord
  has_many :participants, inverse_of: :retrospective
  has_many :zones, inverse_of: :retrospective
  has_many :reflections, through: :zones
  has_many :reactions, through: :reflections
  has_many :tasks, through: :participants, source: :created_tasks

  belongs_to :organizer, class_name: 'Participant', inverse_of: :organized_retrospective
  belongs_to :revealer, class_name: 'Participant', inverse_of: :revealing_retrospective, optional: true
  belongs_to :discussed_reflection, class_name: 'Reflection', optional: true

  before_create :add_first_participant
  before_create :initialize_zones

  accepts_nested_attributes_for :organizer

  enum kind: {
    kds: 'kds',
    kalm: 'kalm',
    daki: 'daki',
    starfish: 'starfish',
    pmi: 'pmi',
    glad_sad_mad: 'glad_sad_mad',
    four_l: 'four_l',
    sailboat: 'sailboat',
    truths_lie: 'truths_lie',
    twitter: 'twitter',
    timeline: 'timeline',
    traffic_lights: 'traffic_lights',
    oscars_gerards: 'oscars_gerards',
    star_wars: 'star_wars',
    day_z: 'day_z',
    dixit: 'dixit',
    postcard: 'postcard'
  }

  enum step: {
    gathering: 'gathering',
    thinking: 'thinking',
    grouping: 'grouping',
    voting: 'voting',
    actions: 'actions',
    done: 'done'
  }

  def as_json
    {
      id: id,
      name: name,
      kind: kind,
      zones: zones.as_json,
      discussedReflection: discussed_reflection&.readable,
      tasks: tasks.order(:created_at).as_json
    }
  end

  def as_short_json
    {
      id: id,
      name: name,
      kind: kind,
      createdAt: created_at
    }
  end

  def initial_state(current_user = nil)
    state = {
      participants: participants.order(:created_at).map(&:profile),
      step: step,
      ownReflections: current_user ? current_user.reflections.order(:created_at).map(&:readable) : [],
      ownReactions: current_user ? current_user.reactions.map(&:readable) : [],
      discussedReflection: discussed_reflection&.readable,
      allColors: Participant::COLORS,
      availableColors: available_colors,
      tasks: tasks.order(:created_at).as_json,
      serverTime: Time.zone.now,
      timerEndAt: timer_end_at,
      organizerInfo: organizer_info
    }

    unless step.in?(%w[gathering thinking])
      state.merge!(visibleReflections: reflections.revealed.order(:created_at).map(&:readable))
    end

    if step.in?(%w[grouping voting])
      state.merge!(visibleReactions: reactions.emoji.map(&:readable))
    elsif step.in?(%w[actions done])
      state.merge!(visibleReactions: reactions.map(&:readable))
    end

    state
  end

  def organizer_info
    clear_info =
      participants.includes(:reactions).reduce({}) do |memo, participant|
        memo[participant.id] = {
          remainingVotes: Reaction::MAX_VOTES - participant.reactions.select(&:vote?).count
        }

        memo
      end

    cipher = OpenSSL::Cipher.new('AES-256-CBC')
    cipher.encrypt
    cipher.key = Digest::SHA256.new.update(organizer.encryption_key).digest
    cipher.iv = Base64.encode64(name).chomp.ljust(16, '0')[0...16]
    encrypted_data = cipher.update(clear_info.to_json) + cipher.final

    Base64.strict_encode64(encrypted_data).chomp
  end

  def next_step!
    return if step == 'done'

    next_step = Retrospective.steps.keys[step_index + 1]
    if next_step == 'actions'
      most_upvoted_reflection =
        reactions
        .select(&:vote?)
        .group_by(&:target)
        .transform_values(&:count)
        .sort_by { |_, v| -v }
        .map(&:first)
        .first
    end

    update!(step: next_step, discussed_reflection: most_upvoted_reflection || discussed_reflection)

    params = { next_step: next_step }
    params[:visibleReflections] =
      case next_step
      when 'grouping'
        reflections.revealed.map(&:readable)
      when 'actions', 'done'
        reflections.joins(:votes).distinct.eager_load(:owner, zone: :retrospective).map(&:readable)
      else
        []
      end

    params[:visibleReactions] =
      case next_step
      when 'grouping', 'voting'
        reactions.emoji.map(&:readable)
      when 'actions', 'done'
        reactions.map(&:readable)
      else
        []
      end

    params[:discussedReflection] = discussed_reflection&.readable if %w(actions done).include?(step)

    broadcast_order(:next, **params)
  end

  def change_organizer!
    other_participant = participants.logged_in.order(:created_at).reject { |participant| participant === organizer }.first
    return unless other_participant

    current_organizer = organizer
    update!(organizer: other_participant)
    broadcast_order(:refreshParticipant, participant: other_participant.reload.profile)
    broadcast_order(:refreshParticipant, participant: current_organizer.reload.profile)
    broadcast_order(:updateOrganizerInfo, organizerInfo: organizer_info)
  end

  def reset_original_organizer!
    original_organizer = participants.order(:created_at).first
    return unless original_organizer.logged_in

    previous_organizer = organizer
    update!(organizer: original_organizer)
    broadcast_order(:refreshParticipant, participant: original_organizer.reload.profile)
    broadcast_order(:refreshParticipant, participant: previous_organizer.reload.profile)
    broadcast_order(:updateOrganizerInfo, organizerInfo: organizer_info)
  end

  def available_colors
    Participant::ALL_COLORS - participants.pluck(:color).compact
  end

  private

  def add_first_participant
    participants << organizer
  end

  def initialize_zones
    case kind
    when 'glad_sad_mad'
      zones.build(identifier: 'Glad')
      zones.build(identifier: 'Sad')
      zones.build(identifier: 'Mad')
    when 'sailboat'
      zones.build(identifier: 'Wind')
      zones.build(identifier: 'Anchor')
      zones.build(identifier: 'Rocks')
      zones.build(identifier: 'Island')
    when 'starfish'
      zones.build(identifier: 'Keep')
      zones.build(identifier: 'Start')
      zones.build(identifier: 'Stop')
      zones.build(identifier: 'More')
      zones.build(identifier: 'Less')
    end
  end

  def step_index
    Retrospective.steps.keys.index(step)
  end

  def broadcast_order(action, **parameters)
    OrchestratorChannel.broadcast_to(self, action: action, parameters: parameters)
  end
end
