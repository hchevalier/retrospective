# frozen_string_literal: true

class Retrospective < ApplicationRecord
  has_many :participants, inverse_of: :retrospective
  has_many :pending_invitations
  has_many :zones, inverse_of: :retrospective
  has_many :reflections, through: :zones
  has_many :topics
  has_many :reactions
  has_many :tasks, through: :participants, source: :created_tasks
  has_many :pending_tasks, -> { where(status: %i(todo on_hold)) }, through: :participants, class_name: 'Task', source: :created_tasks

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
    kinds[:pmi] => 'Builders::PlusMinusInteresting',
    kinds[:sailboat] => 'Builders::Sailboat',
    kinds[:starfish] => 'Builders::Starfish',
    kinds[:traffic_lights] => 'Builders::TrafficLights',
    kinds[:oscars_gerards] => 'Builders::OscarsGerards',
  }.freeze

  def self.available_kinds
    [
      kinds[:glad_sad_mad],
      kinds[:pmi],
      kinds[:sailboat],
      kinds[:starfish],
      kinds[:traffic_lights],
      kinds[:oscars_gerards],
    ]
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
      tasks: tasks.sort_by { |task| task.created_at }.as_json,
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
        group: { pending_tasks: [:assignee, :author,  :retrospective, reflection: [:zone, :topic, :owner]] }
      }
    end
    included_relationships << [:zones] if reached_step?('thinking', reference: target_step)
    included_relationships << { reactions: [:author, :target], reflections: [:zone, :topic, :owner] } if reached_step?('grouping', reference: target_step)
    included_relationships << { discussed_reflection: [:zone, :topic, :owner] } if reached_step?('voting', reference: target_step)
    included_relationships << { tasks: [:retrospective, :author, :assignee, reflection: :zone] } if reached_step?('actions', reference: target_step)

    included_relationships
  end

  def initial_state(current_participant)
    state = {
      participants: participants.sort_by { |participant| participant.created_at }.map(&:profile),
      step: step,
      ownReflections: reached_step?('thinking') ? current_participant.reflections.sort_by { |reflection| reflection.created_at }.map(&:readable) : [],
      ownReactions: reached_step?('thinking') ? current_participant.reactions.map(&:readable) : [],
      discussedReflection: reached_step?('voting') ? discussed_reflection&.readable : nil,
      allColors: Participant::COLORS,
      availableColors: available_colors,
      tasks: reached_step?('actions') ? tasks.sort_by { |task| task.created_at }.as_json : [],
      pendingTasks: step == 'reviewing' ? group.pending_tasks.as_json : [],
      serverTime: Time.zone.now,
      timerEndAt: timer_end_at,
      facilitatorInfo: facilitator_info
    }

    state.merge!(visibleReflections: visible_reflections_for_step(step)) unless step.in?(%w[gathering reviewing thinking])

    if step.in?(%w[grouping voting])
      state.merge!(visibleReactions: reactions.select(&:emoji?).map(&:readable))
    elsif step.in?(%w[actions done])
      state.merge!(visibleReactions: reactions.map(&:readable))
    end

    state
  end

  def facilitator_info
    participants_relationship = participants.loaded? ? participants : participants.includes(:reactions)
    clear_info =
      participants_relationship.reduce({}) do |memo, participant|
        memo[participant.id] = {
          remainingVotes: Reaction::MAX_VOTES - participant.reactions.select(&:vote?).count
        }

        memo[participant.id].merge!(stepDone: participant.step_done) if step == 'thinking'

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

    new_step = Retrospective.steps.keys[step_index + 1]
    new_step = Retrospective.steps.keys[step_index + 2] if new_step == 'reviewing' && group.pending_tasks.none?

    if new_step == 'voting' && zones_typology == :single_choice
      builder.autovote!(self)
      new_step = Retrospective.steps.keys[step_index + 2]
      reload
    end

    if new_step == 'actions'
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

    update!(step: new_step, discussed_reflection: most_upvoted_target || discussed_reflection)

    params = { next_step: new_step }
    params[:visibleReflections] = visible_reflections_for_step(new_step)

    params[:visibleReactions] =
      case new_step
      when 'grouping', 'voting'
        reactions.emoji.map(&:readable)
      when 'actions', 'done'
        reactions.map(&:readable)
      else
        []
      end

    params[:pendingTasks] = group.pending_tasks.as_json if new_step == 'reviewing'
    params[:discussedReflection] = discussed_reflection&.readable if %w(actions done).include?(new_step)

    broadcast_order(:next, **params)
  end

  def visible_reflections_for_step(step)
    case step
    when 'grouping', 'voting'
      reflections.select(&:revealed?).sort_by { |reflection| reflection.created_at }.map(&:readable)
    when 'actions'
      reflections
        .reject { |reflection| reflection.votes.none? && (reflection.topic.nil? || reflection.topic.votes.none?) }
        .map(&:readable)
    when 'done'
      reflections.map(&:readable)
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
    return if step == 'done'

    original_facilitator = participants.sort_by { |participant| participant.created_at }.first
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
