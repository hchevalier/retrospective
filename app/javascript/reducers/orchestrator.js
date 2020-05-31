export const initialState = {
  allColors: [],
  availableColors: [],
  zones: [],
  step: '',
  subscription: null,
  organizerInfo: null
}

const orchestrator = (state = initialState, action) => {
  switch (action.type) {
    case 'change-step':
      return { ...state, step: action.step }
    case 'set-channel':
      return { ...state, subscription: action.subscription }
    case 'update-organizer-info':
      return { ...state, organizerInfo: action.organizerInfo }
    default:
      return state
  }
}

export default orchestrator
