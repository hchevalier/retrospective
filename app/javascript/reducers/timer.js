const intialState = {
  timerEndAt: null,
  timeOffset: 0
}

const timer = (state = intialState, action) => {
  switch (action.type) {
    case 'start-timer':
      return { ...state, timerEndAt: action.timerEndAt }
    default:
      return state;
  }
}

export default timer
