class Retrospective < ApplicationRecord
  has_many :participants
  has_one :organizer, -> { order(:created_at).limit(1) }, class_name: 'Participant'
  has_many :zones
  has_many :reflections, through: :zones
  has_many :reactions, through: :reflections

  belongs_to :discussed_reflection, class_name: 'Reflection', optional: true

  before_create :initialize_zones

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

  def as_json(current_user = nil)
    {
      id: id,
      name: name,
      kind: kind,
      zones: zones.as_json,
      discussed_reflection: discussed_reflection
    }
  end

  def initial_state(current_user = nil)
    state = {
      participants: participants.map(&:profile),
      step: step,
      ownReflections: current_user ? reflections.where(owner: current_user).map(&:readable) : [],
      ownReactions: current_user ? current_user.reactions.map(&:readable) : [],
      discussedReflection: discussed_reflection&.readable,
      allColors: Participant::COLORS,
      availableColors: available_colors
    }

    state.merge!(allReflections: reflections.map(&:readable)) unless step.in?(%w(gathering thinking))
    if step.in?(%w(grouping voting))
      state.merge!(allReactions: reactions.where(kind: :emoji).map(&:readable))
    elsif step.in?(%w(actions done))
      state.merge!(allReactions: reactions.map(&:readable))
    end

    return state unless timer_end_at && (remaining_time = timer_end_at - Time.now ) > 0

    state.merge(
      timerDuration: remaining_time,
      lastTimerReset: Time.now.to_i
    )
  end

  def next_step!
    return if step == 'done'

    next_step = Retrospective::steps.keys[step_index + 1]
    first_reflection = reflections.group_by(&:owner_id).values.flatten.first
    update!(step: next_step, discussed_reflection: first_reflection)

    params = { next_step: next_step }
    params[:allReflections] =
      case next_step
      when 'grouping'
        reflections.map(&:readable)
      when 'actions'
        reflections.joins(:reactions).map(&:readable)
      else
        []
      end
    params[:discussedReflection] = first_reflection&.readable if %w(grouping actions).include?(step)

    broadcast_order(:next, **params)
  end

  def available_colors
    Participant::ALL_COLORS - participants.pluck(:color).compact
  end

  private

  def initialize_zones
    case kind
    when 'glad_sad_mad'
      zones.build(identifier: 'Glad')
      zones.build(identifier: 'Sad')
      zones.build(identifier: 'Mad')
    end
  end

  def step_index
    Retrospective::steps.keys.index(step)
  end

  def broadcast_order(action, **parameters)
    OrchestratorChannel.broadcast_to(self, action: action, parameters: parameters)
  end
end
