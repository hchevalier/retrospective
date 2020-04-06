import { createStore } from 'redux'
import rootReducer from 'reducers/root_reducer'

const initialState = {
  profile: null,
  participants: [],
  zones: [],
  step: '',
  ownReflections: [],
  channels: {},
  timerDuration: 600,
  lastTimerReset: null
}

const appStore = (railsState) => createStore(rootReducer, { ...initialState, ...railsState })

export default appStore
