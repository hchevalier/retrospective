import { reject, uniqBy } from 'lib/helpers/array'

const rootReducer = (state, action) => {
  switch (action.type) {
    case 'change-step':
      return { ...state, step: action.step }
    case 'login':
      return { ...state, participants: uniqBy([action.profile, ...state.participants], 'uuid') }
    case 'new-participant':
      return { ...state, participants: uniqBy([...state.participants, action.newParticipant], 'uuid') }
    case 'set-channel':
      return { ...state, channels: { ...state.channels, [action.channelName]: action.channel} }
    case 'add-reflection':
      return { ...state, ownReflections: [...state.ownReflections, action.reflection] }
    case 'change-reflection':
      return { ...state, ownReflections: [...state.ownReflections].map((reflection) => reflection.id == action.reflection.id ? action.reflection : reflection) }
    case 'delete-reflection':
      return { ...state, ownReflections: reject(state.ownReflections, (reflection) => reflection.id == action.reflectionId) }
    case 'start-timer':
      return { ...state, lastTimerReset: new Date().getTime(), timerDuration: action.duration }
    default:
      return state
  }
}

export default rootReducer
