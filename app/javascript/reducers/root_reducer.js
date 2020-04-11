import { reject, uniqBy } from 'lib/helpers/array'

const rootReducer = (state, action) => {
  switch (action.type) {
    case 'change-step':
      const reflections = action.visibleReflections?.length > 0 ? action.visibleReflections : state.visibleReflections
      return { ...state, step: action.step, visibleReflections: reflections, discussedReflection: action.discussedReflection }
    case 'login':
      return {
        ...state,
        participants: uniqBy([action.profile, ...state.participants], 'uuid'),
        profile: action.profile,
        organizer: action.profile.organizer,
        ...action.additionnalInfo
      }
    case 'new-participant':
      return { ...state, participants: uniqBy([...state.participants, action.newParticipant], 'uuid') }
    case 'change-participant-status':
      return { ...state, participants: updateParticipant(state.participants, action.participant) }
    case 'change-organizer':
      return { ...state, participants: updateParticipant(state.participants, action.newOrganizer), organizer: action.newOrganizer.uuid === state.profile.uuid }
    case 'change-color':
      const participants = updateParticipant(state.participants, action.participant)
      return { ...state, availableColors: action.availableColors, participants: participants }
    case 'set-channel':
      return { ...state, orchestrator: action.subscription }
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

const updateParticipant = (oldParticipants, participant) => {
  return [...oldParticipants].map((oldParticipant) => oldParticipant.uuid === participant.uuid ? participant : oldParticipant)
}

export default rootReducer
