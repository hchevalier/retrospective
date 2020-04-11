import { reject, uniqBy } from 'lib/helpers/array'

const rootReducer = (state, action) => {
  switch (action.type) {
    case 'change-step':
      return { ...state, step: action.step, allReflections: action.allReflections?.length > 0 ? action.allReflections : state.allReflections }
    case 'login':
      return {
        ...state,
        participants: uniqBy([action.profile, ...state.participants], 'uuid'),
        profile: action.profile,
        ...action.additionnalInfo
      }
    case 'new-participant':
      return { ...state, participants: uniqBy([...state.participants, action.newParticipant], 'uuid') }
    case 'change-color':
      const participants = [...state.participants].map((participant) => participant.uuid == action.participant.uuid ? action.participant : participant)
      return {
        ...state,
        availableColors: action.availableColors,
        participants: participants
      }
    case 'set-channel':
      return { ...state, orchestrator: action.channel }
    case 'add-reflection':
      return { ...state, ownReflections: [...state.ownReflections, action.reflection] }
    case 'change-reflection':
      return { ...state, ownReflections: [...state.ownReflections].map((reflection) => reflection.id == action.reflection.id ? action.reflection : reflection) }
    case 'delete-reflection':
      return { ...state, ownReflections: reject(state.ownReflections, (reflection) => reflection.id == action.reflectionId) }
    case 'add-reaction':
      return { ...state, ownReactions: [...state.ownReactions, action.reaction] }
    case 'delete-reaction':
      return { ...state, ownReactions: reject(state.ownReactions, (reaction) => reaction.id == action.reactionId) }
    case 'start-timer':
      return { ...state, lastTimerReset: new Date().getTime(), timerDuration: action.duration }
    default:
      return state
  }
}

export default rootReducer
