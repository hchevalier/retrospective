import { createStore } from 'redux'
import rootReducer from 'reducers/root_reducer'

const defaultState = {
  profile: null,
  participants: [],
  zones: [],
  step: '',
  ownReflections: [],
  allReflections: [],
  channels: {},
  timerDuration: 600,
  lastTimerReset: null
}

const appStore = (initialState) => createStore(rootReducer, { ...defaultState, ...initialState })

export default appStore
