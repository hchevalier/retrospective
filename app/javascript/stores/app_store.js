import { createStore } from 'redux'
import rootReducer from 'reducers/root_reducer'

const defaultState = {
  allColors: [],
  availableColors: [],
  profile: null,
  organizer: false,
  participants: [],
  retrospective: null,
  zones: [],
  step: '',
  ownReflections: [],
  visibleReflections: [],
  discussedReflection: null,
  ownReactions: [],
  orchestrator: null,
  timerDuration: 600,
  lastTimerReset: null
}

const appStore = (initialState) => createStore(rootReducer, { ...defaultState, ...initialState })

export default appStore
