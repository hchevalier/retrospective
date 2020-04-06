class Retrospective < ApplicationRecord
  has_many :participants
  has_one :organizer, -> { order(:created_at).limit(1) }, class_name: 'Participant'
  has_many :zones
  has_many :reflections, through: :zones

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
      zones: zones.as_json
    }
  end

  def initial_state(current_user = nil)
    state = {
      participants: participants.map(&:profile),
      step: step,
      ownReflections: current_user ? reflections.where(owner: current_user).map(&:readable) : [],
    }

    return state unless timer_end_at && (remaining_time = timer_end_at - Time.now ) > 0

    state.merge(
      timerDuration: remaining_time,
      lastTimerReset: Time.now.to_i
    )
  end

  def next_step!
    return if step == 'done'
    update!(step: Retrospective::steps.keys[step_index + 1])
    broadcast_order(:next, next_step: step)
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
