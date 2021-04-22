# frozen_string_literal: true

class Retrospective < ApplicationRecord
  has_many :participants, inverse_of: :retrospective, dependent: :destroy
  has_many :pending_invitations, dependent: :destroy
  has_many :zones, inverse_of: :retrospective, dependent: :destroy
  has_many :reflections, through: :zones
  has_many :topics, dependent: :destroy
  has_many :reactions, dependent: :destroy
  has_many :tasks, through: :participants, source: :created_tasks
  has_many :pending_tasks, -> { where(status: %i[todo on_hold]) },
           { through: :participants, class_name: 'Task', source: :created_tasks }

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
    kinds[:four_l] => 'Builders::FourL',
    kinds[:glad_sad_mad] => 'Builders::GladSadMad',
    kinds[:pmi] => 'Builders::PlusMinusInteresting',
    kinds[:sailboat] => 'Builders::Sailboat',
    kinds[:starfish] => 'Builders::Starfish',
    kinds[:timeline] => 'Builders::Timeline',
    kinds[:traffic_lights] => 'Builders::TrafficLights',
    kinds[:oscars_gerards] => 'Builders::OscarsGerards'
  }.freeze

  def self.available_kinds
    [
      kinds[:glad_sad_mad],
      kinds[:pmi],
      kinds[:four_l],
      kinds[:sailboat],
      kinds[:starfish],
      kinds[:timeline],
      kinds[:traffic_lights],
      kinds[:oscars_gerards]
    ]
  end

  delegate :zones_typology, to: :builder, allow_nil: true

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
      tasks: tasks.sort_by(&:created_at).as_json,
      step: step
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
      createdAt: created_at,
      step: step
    }
  end

  def reached_step?(checked_step, reference: nil)
    reference_step_index = reference ? Retrospective.steps.keys.index(reference.to_s) : step_index
    reference_step_index >= Retrospective.steps.keys.index(checked_step.to_s)
  end

  def relationships_to_load(target_step = nil)
    target_step ||= step

    included_relationships = [participants: :reactions]
    if target_step == 'reviewing'
      included_relationships << {
        group: { pending_tasks: [:assignee, :author, :retrospective, reflection: %i[zone topic owner]] }
      }
    end
    included_relationships << [:zones] if reached_step?('thinking', reference: target_step)
    if reached_step?('grouping', reference: target_step)
      included_relationships << { reactions: %i[author target], reflections: %i[zone topic owner] }
    end
    if reached_step?('voting', reference: target_step)
      included_relationships << { discussed_reflection: %i[zone topic owner] }
    end
    if reached_step?('actions', reference: target_step)
      included_relationships << { tasks: [:retrospective, :author, :assignee, reflection: :zone] }
    end

    included_relationships
  end

  def initial_state(current_participant)
    {
      participants: participants.sort_by(&:created_at).map(&:profile),
      step: step,
      discussedReflection: reached_step?('voting') ? discussed_reflection&.readable : nil,
      allColors: Participant::COLORS,
      availableColors: available_colors,
      tasks: reached_step?('actions') ? tasks.sort_by(&:created_at).as_json : [],
      pendingTasks: step == 'reviewing' ? group.pending_tasks.as_json : [],
      serverTime: Time.zone.now,
      timerEndAt: timer_end_at,
      facilitatorInfo: facilitator_info,
      **visible_reflections_and_reactions,
      **participant_related_state(current_participant)
    }
  end

  def visible_reflections_and_reactions
    state = {}

    unless step.in?(%w[gathering reviewing thinking])
      state.merge!(visibleReflections: visible_reflections_for_step(step))
    end

    if step.in?(%w[grouping voting])
      state.merge!(visibleReactions: reactions.select(&:emoji?).map(&:readable))
    elsif step.in?(%w[actions done])
      state.merge!(visibleReactions: reactions.map(&:readable))
    end

    state
  end

  def participant_related_state(participant)
    reached_thinking = reached_step?('thinking')

    {
      ownReflections: reached_thinking ? participant.reflections.sort_by(&:created_at).map(&:readable) : [],
      ownReactions: reached_thinking ? participant.reactions.map(&:readable) : []
    }
  end

  # rubocop:todo Metrics/AbcSize
  def facilitator_info
    participants_relationship = participants.loaded? ? participants : participants.includes(:reactions)
    clear_info =
      participants_relationship.each_with_object({}) do |participant, memo|
        memo[participant.id] = { remainingVotes: Reaction::MAX_VOTES - participant.reactions.select(&:vote?).count }
        memo[participant.id].merge!(stepDone: participant.step_done) if step == 'thinking'
      end

    cipher = OpenSSL::Cipher.new('AES-256-CBC')
    cipher.encrypt
    cipher.key = Digest::SHA256.new.update(facilitator.encryption_key).digest
    cipher.iv = Base64.encode64(id).chomp.ljust(16, '0')[0...16]
    encrypted_data = cipher.update(clear_info.to_json) + cipher.final

    Base64.strict_encode64(encrypted_data).chomp
  end
  # rubocop:enable Metrics/AbcSize

  def next_step!
    return if step == 'done'

    new_step = Retrospective.steps.keys[step_index + 1]
    new_step = Retrospective.steps.keys[step_index + 2] if new_step == 'reviewing' && group.pending_tasks.none?
    new_step = skip_vote! if new_step == 'voting' && zones_typology == :single_choice

    most_upvoted_target = handle_actions_step if new_step == 'actions'

    update!(step: new_step, discussed_reflection: most_upvoted_target || discussed_reflection)

    broadcast_order(:next, **state_for_step(new_step))
  end

  def visible_reflections_for_step(step)
    case step
    when 'grouping', 'voting'
      reflections.select(&:revealed?).sort_by(&:created_at).map(&:readable)
    when 'actions'
      visible_reflections_for_action_step
    when 'done'
      reflections.map(&:readable)
    else
      []
    end
  end

  def change_facilitator!
    other_participant =
      participants.logged_in.order(:created_at).reject { |participant| participant == facilitator }.first
    return unless other_participant

    current_facilitator = facilitator
    update!(facilitator: other_participant)
    broadcast_order(:refreshParticipant, participant: other_participant.reload.profile)
    broadcast_order(:refreshParticipant, participant: current_facilitator.reload.profile)
    broadcast_order(:updateFacilitatorInfo, facilitatorInfo: facilitator_info)
  end

  def reset_original_facilitator!
    return if step == 'done'

    original_facilitator = participants.min_by(&:created_at)
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

  def next_step
    Retrospective.steps.keys[Retrospective.steps.keys.index(step) + 1]
  end

  def add_zone(identifier, hint: nil)
    zones.build(identifier: identifier, hint: hint)
  end

  def broadcast_order(action, **parameters)
    OrchestratorChannel.broadcast_to(self, action: action, parameters: parameters)
  end

  def find_participant_with_relationships(participant_id)
    participants
      .includes(:retrospective, :reactions, reflections: [:topic, :owner, zone: :retrospective])
      .find(participant_id)
  end

  def participant_for_account(account)
    participants.find { |participant| participant.account == account }
  end

  def add_participant_for_account(account)
    participants.create!(surname: account.username, account_id: account.id)
  end

  private

  # rubocop:disable Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity
  def state_for_step(target_step)
    params = { next_step: target_step }
    params[:visibleReflections] = visible_reflections_for_step(target_step)

    params[:visibleReactions] =
      case target_step
      when 'grouping', 'voting'
        reactions.emoji.map(&:readable)
      when 'actions', 'done'
        reactions.map(&:readable)
      else
        []
      end

    params[:pendingTasks] = group.pending_tasks.as_json if target_step == 'reviewing'
    params[:discussedReflection] = discussed_reflection&.readable if %w[actions done].include?(target_step)
    if target_step == 'actions' && kind == 'timeline'
      params[:participants] = participants.sort_by(&:created_at).map(&:profile)
    end

    params
  end
  # rubocop:enable Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity

  def skip_vote!
    builder.autovote!(self)
    new_step = Retrospective.steps.keys[step_index + 2]
    reload

    new_step
  end

  def most_upvoted_topic_or_reflection
    reactions
      .select(&:vote?)
      .group_by(&:target)
      .transform_values(&:count)
      .sort_by { |_, v| -v }
      .map(&:first)
      .first
  end

  def handle_actions_step
    most_upvoted_target = most_upvoted_topic_or_reflection
    most_upvoted_target = most_upvoted_target.reflections.first if most_upvoted_target.is_a?(Topic)
    TaskReminderJob.set(wait: 7.days).perform_later(retrospective: self)

    most_upvoted_target
  end

  def visible_reflections_for_action_step
    reflections
      .reject { |reflection| reflection.votes.none? && (reflection.topic.nil? || reflection.topic.votes.none?) }
      .map(&:readable)
  end

  def builder
    BUILDERS[kind]&.constantize
  end

  def add_first_participant
    participants << facilitator
  end

  def initialize_zones
    builder&.build(self)
  end

  def step_index
    Retrospective.steps.keys.index(step)
  end
end
