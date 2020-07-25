const initialGroupState = {
  pendingTasks: []
}

const group = (state = initialGroupState, action) => {
  switch (action.type) {
    case 'change-step': {
      return { ...state, pendingTasks: action.pendingTasks || [] }
    }
    default:
      return state
  }
}

export default group
