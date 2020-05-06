export const initialState = {
  allColors: [],
  availableColors: [],
  zones: [],
  step: '',
  subscription: null
}

const orchestrator = (state = initialState, action) => {
  switch (action.type) {
    case 'change-step':
      return { ...state, step: action.step }
    case 'set-channel':
      return { ...state, subscription: action.subscription }
    default:
      return state
  }
}

export default orchestrator
