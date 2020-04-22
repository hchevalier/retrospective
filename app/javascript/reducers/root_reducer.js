import { reject, uniqBy } from 'lib/helpers/array'

const rootReducer = (state, action) => {
  let profile = state.profile
  let participants = state.participants
  let ownReflections = state.ownReflections

  switch (action.type) {
    case 'change-step':
      const reflections = action.visibleReflections?.length > 0 ? action.visibleReflections : state.visibleReflections
      const reactions = action.visibleReactions?.length > 0 ? action.visibleReactions : state.visibleReactions
      return { ...state, step: action.step, visibleReflections: reflections, discussedReflection: action.discussedReflection, visibleReactions: reactions }
    case 'login':
      return {
        ...state,
        participants: uniqBy([action.profile, ...participants], 'uuid'),
        profile: action.profile,
        ...action.additionnalInfo
      }
    case 'new-participant':
      return { ...state, participants: uniqBy([...participants, action.newParticipant], 'uuid') }
    case 'refresh-participant':
      profile = action.participant.uuid === profile?.uuid ? action.participant : profile
      participants = updateArray(participants, action.participant, 'uuid')
      return { ...state, participants: participants, profile: profile }
    case 'change-color':
      profile = action.participant.uuid === profile?.uuid ? action.participant : profile
      participants = updateArray(participants, action.participant, 'uuid')
      return { ...state, availableColors: action.availableColors, participants: participants, profile: profile }
    case 'set-channel':
      return { ...state, orchestrator: action.subscription }
    case 'add-reflection':
      return { ...state, ownReflections: [...state.ownReflections, action.reflection] }
    case 'reveal-reflection':
      ownReflections = updateArray(ownReflections, action.reflection, 'id')
      return { ...state, visibleReflections: [...state.visibleReflections, action.reflection], ownReflections: ownReflections }
    case 'change-reflection':
      ownReflections = updateArray(ownReflections, action.reflection, 'id')
      return { ...state, ownReflections: ownReflections }
    case 'delete-reflection':
      return { ...state, ownReflections: reject(state.ownReflections, (reflection) => reflection.id === action.reflectionId) }
    case 'set-discussed-reflection':
      return { ...state, discussedReflection: action.reflection }
    case 'add-reaction':
      return { ...state, ownReactions: [...state.ownReactions, action.reaction] }
    case 'push-reaction':
      return { ...state, visibleReactions: [...state.visibleReactions, action.reaction] }
    case 'drop-reaction':
      return { ...state, visibleReactions: reject(state.visibleReactions, (reaction) => reaction.id == action.reactionId) }
    case 'delete-reaction':
      return { ...state, ownReactions: reject(state.ownReactions, (reaction) => reaction.id == action.reactionId) }
    case 'add-task':
      return { ...state, tasks: [...state.tasks, action.task] }
    case 'change-task':
      return { ...state, tasks: updateArray(state.tasks, action.task, 'id') }
    case 'start-timer':
      return { ...state, lastTimerReset: new Date().getTime(), timerDuration: action.duration }
    default:
      return state
  }
}

const updateArray = (array, newItem, attribute) => {
  return array.map(item => item[attribute] === newItem[attribute] ? newItem : item)
}

export default rootReducer
