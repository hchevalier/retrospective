import { reject, uniq, uniqBy } from 'lib/helpers/array'

const rootReducer = (state, action) => {
  let profile = state.profile

  switch (action.type) {
    case 'change-step':
      const reflections = action.visibleReflections?.length > 0 ? action.visibleReflections : state.visibleReflections
      const reactions = action.visibleReactions?.length > 0 ? action.visibleReactions : state.visibleReactions
      return { ...state, step: action.step, visibleReflections: reflections, discussedReflection: action.discussedReflection, visibleReactions: reactions }
    case 'login':
      return {
        ...state,
        participants: uniqBy([action.profile, ...state.participants], 'uuid'),
        profile: action.profile,
        ...action.additionnalInfo
      }
    case 'new-participant':
      return { ...state, participants: uniqBy([...state.participants, action.newParticipant], 'uuid') }
    case 'refresh-participant':
      profile = action.participant.uuid === profile?.uuid ? action.participant : profile
      return { ...state, participants: updateParticipant(state.participants, action.participant), profile: profile }
    case 'change-color':
      const participants = updateParticipant(state.participants, action.participant)
      profile = action.participant.uuid === profile?.uuid ? action.participant : profile
      return { ...state, availableColors: action.availableColors, participants: participants, profile: profile }
    case 'set-channel':
      return { ...state, orchestrator: action.subscription }
    case 'add-reflection':
      return { ...state, ownReflections: [...state.ownReflections, action.reflection] }
    case 'reveal-reflection':
      return { ...state, visibleReflections: [...state.visibleReflections, action.reflection], ownReflections: updateReflection(state.ownReflections, action.reflection) }
    case 'change-reflection':
      return { ...state, ownReflections: updateReflection(state.ownReflections, action.reflection) }
    case 'delete-reflection':
      return { ...state, ownReflections: reject(state.ownReflections, (reflection) => reflection.id === action.reflectionId) }
    case 'set-discussed-reflection':
      return { ...state, discussedReflection: action.reflection }
    case 'add-reaction':
      return { ...state, ownReactions: [...state.ownReactions, action.reaction], ...completeCall(state, action.type)  }
    case 'push-reaction':
      return { ...state, visibleReactions: [...state.visibleReactions, action.reaction] }
    case 'drop-reaction':
      return { ...state, visibleReactions: reject(state.visibleReactions, (reaction) => reaction.id == action.reactionId) }
    case 'delete-reaction':
      return { ...state, ownReactions: reject(state.ownReactions, (reaction) => reaction.id == action.reactionId), ...completeCall(state, action.type) }
    case 'start-timer':
      return { ...state, lastTimerReset: new Date().getTime(), timerDuration: action.duration }
    case 'add-pending-network-call':
      return { ...state, pendingNetworkCalls: uniq([...state.pendingNetworkCalls, action.callName]) }
    case 'complete-pending-network-call':
      return { ...state, ...completeCall(state, action.callName) }
    default:
      return state
  }
}

const completeCall = (state, callName) => { return { pendingNetworkCalls: reject(state.pendingNetworkCalls, (item) => item === callName) } }

const updateParticipant = (oldParticipants, participant) => {
  return [...oldParticipants].map((oldParticipant) => oldParticipant.uuid === participant.uuid ? participant : oldParticipant)
}

const updateReflection = (oldReflections, reflection) => {
  return [...oldReflections].map((oldReflection) => oldReflection.id === reflection.id ? reflection : oldReflection)
}

export default rootReducer
