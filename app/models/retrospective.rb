# frozen_string_literal: true

class Retrospective < ApplicationRecord
  has_many :participants, inverse_of: :retrospective
  has_many :pending_invitations
  has_many :zones, inverse_of: :retrospective
  has_many :reflections, through: :zones
  has_many :topics
  has_many :reactions
  has_many :tasks, through: :participants, source: :created_tasks
  has_many :pending_tasks, -> { where(status: :todo) }, through: :participants, class_name: 'Task', source: :created_tasks

  belongs_to :group
  belongs_to :facilitator, class_name: 'Participant', inverse_of: :organized_retrospective
  belongs_to :revealer, class_name: 'Participant', inverse_of: :revealing_retrospective, optional: true
  belongs_to :discussed_reflection, class_name: 'Reflection', optional: true

  before_create :add_first_participant
  before_create :initialize_zones

  accepts_nested_attributes_for :facilitator

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
    reviewing: 'reviewing',
    thinking: 'thinking',
    grouping: 'grouping',
    voting: 'voting',
    actions: 'actions',
    done: 'done'
  }

  BUILDERS = {
    kinds[:glad_sad_mad] => 'Builders::GladSadMad',
    kinds[:sailboat] => 'Builders::Sailboat',
    kinds[:starfish] => 'Builders::Starfish',
    kinds[:traffic_lights] => 'Builders::TrafficLights',
  }.freeze

  def self.available_kinds
    [kinds[:glad_sad_mad], kinds[:sailboat], kinds[:starfish], kinds[:traffic_lights]]
  end

  def zones_typology
    builder.zones_typology
  end

  def as_json
    {
      id: id,
      group: {
        id: group.id,
        name: group.name
      },
      kind: kind,
      zones: zones.as_json,
      zonesTypology: zones_typology,
      discussedReflection: discussed_reflection&.readable,
      tasks: tasks.order(:created_at).as_json
    }
  end

  def as_short_json
    {
      id: id,
      group: {
        id: group.id,
        name: group.name
      },
      kind: kind,
      zonesTypology: zones_typology,
      createdAt: created_at
    }
  end

  def initial_state(current_user = nil)
    state = {
      participants: participants.order(:created_at).map(&:profile),
      step: step,
      ownReflections: current_user ? current_user.reflections.includes(:zone, :topic).order(:created_at).map(&:readable) : [],
      ownReactions: current_user ? current_user.reactions.map(&:readable) : [],
      discussedReflection: discussed_reflection&.readable,
      allColors: Participant::COLORS,
      availableColors: available_colors,
      tasks: tasks.order(:created_at).as_json,
      pendingTasks: group.pending_tasks.as_json,
      serverTime: Time.zone.now,
      timerEndAt: timer_end_at,
      facilitatorInfo: facilitator_info
    }

    state.merge!(visibleReflections: visible_reflections_for_step(step)) unless step.in?(%w[gathering thinking])

    if step.in?(%w[grouping voting])
      state.merge!(visibleReactions: reactions.emoji.map(&:readable))
    elsif step.in?(%w[actions done])
      state.merge!(visibleReactions: reactions.map(&:readable))
    end

    state
  end

  def facilitator_info
    clear_info =
      participants.includes(:reactions).reduce({}) do |memo, participant|
        memo[participant.id] = {
          remainingVotes: Reaction::MAX_VOTES - participant.reactions.select(&:vote?).count
        }

        memo
      end

    cipher = OpenSSL::Cipher.new('AES-256-CBC')
    cipher.encrypt
    cipher.key = Digest::SHA256.new.update(facilitator.encryption_key).digest
    cipher.iv = Base64.encode64(id).chomp.ljust(16, '0')[0...16]
    encrypted_data = cipher.update(clear_info.to_json) + cipher.final

    Base64.strict_encode64(encrypted_data).chomp
  end

  def next_step!
    return if step == 'done'

    next_step = Retrospective.steps.keys[step_index + 1]
    next_step = Retrospective.steps.keys[step_index + 2] if next_step == 'reviewing' && group.pending_tasks.none?

    if next_step == 'voting' && zones_typology == :single_choice
      builder.autovote!(self)
      next_step = Retrospective.steps.keys[step_index + 2]
    end

    if next_step == 'actions'
      most_upvoted_target =
        reactions
        .select(&:vote?)
        .group_by(&:target)
        .transform_values(&:count)
        .sort_by { |_, v| -v }
        .map(&:first)
        .first

      most_upvoted_target = most_upvoted_target.reflections.first if most_upvoted_target&.is_a?(Topic)
    end

    update!(step: next_step, discussed_reflection: most_upvoted_target || discussed_reflection)

    params = { next_step: next_step }
    params[:visibleReflections] = visible_reflections_for_step(next_step)

    params[:visibleReactions] =
      case next_step
      when 'grouping', 'voting'
        reactions.emoji.map(&:readable)
      when 'actions', 'done'
        reactions.map(&:readable)
      else
        []
      end

    params[:pendingTasks] = group.pending_tasks.as_json if step == 'reviewing'
    params[:discussedReflection] = discussed_reflection&.readable if %w(actions done).include?(step)

    broadcast_order(:next, **params)
  end

  def visible_reflections_for_step(step)
    case step
    when 'grouping', 'voting'
      reflections.revealed.includes(:owner).order(:created_at).map(&:readable)
    when 'actions', 'done'
      reflections
        .eager_load(:owner, :votes, topic: :votes, zone: :retrospective)
        .reject { |reflection| reflection.votes.none? && (reflection.topic.nil? || reflection.topic.votes.none?) }
        .map(&:readable)
    else
      []
    end
  end

  def change_facilitator!
    other_participant = participants.logged_in.order(:created_at).reject { |participant| participant === facilitator }.first
    return unless other_participant

    current_facilitator = facilitator
    update!(facilitator: other_participant)
    broadcast_order(:refreshParticipant, participant: other_participant.reload.profile)
    broadcast_order(:refreshParticipant, participant: current_facilitator.reload.profile)
    broadcast_order(:updateFacilitatorInfo, facilitatorInfo: facilitator_info)
  end

  def reset_original_facilitator!
    original_facilitator = participants.order(:created_at).first
    return unless original_facilitator.logged_in

    previous_facilitator = facilitator
    update!(facilitator: original_facilitator)
    broadcast_order(:refreshParticipant, participant: original_facilitator.reload.profile)
    broadcast_order(:refreshParticipant, participant: previous_facilitator.reload.profile)
    broadcast_order(:updateFacilitatorInfo, facilitatorInfo: facilitator_info)
  end

  def available_colors
    Participant::ALL_COLORS - participants.pluck(:color).compact
  end

  private

  def builder
    BUILDERS[kind].constantize
  end

  def add_first_participant
    participants << facilitator
  end

  def initialize_zones
    builder.build(self)
  end

  def step_index
    Retrospective.steps.keys.index(step)
  end

  def broadcast_order(action, **parameters)
    OrchestratorChannel.broadcast_to(self, action: action, parameters: parameters)
  end
end
