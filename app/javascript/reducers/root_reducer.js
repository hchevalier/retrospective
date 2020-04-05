import { uniqBy } from 'lib/helpers/array'

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
    default:
      return state
  }
}

export default rootReducer
