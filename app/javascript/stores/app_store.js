import { createStore, applyMiddleware } from "redux"
import rootReducer from "reducers/root_reducer"
import logger from "redux-logger"

const LATENCY = 200

const defaultState = {
  allColors: [],
  availableColors: [],
  profile: null,
  participants: [],
  retrospective: null,
  zones: [],
  step: "",
  ownReflections: [],
  visibleReflections: [],
  discussedReflection: null,
  ownReactions: [],
  visibleReactions: [],
  orchestrator: null,
  timeOffset: 0,
  timerDuration: 600,
  timerEndAt: null,
  tasks: [],
}

const appStore = ({ serverTime, ...initialState }) =>
  createStore(
    rootReducer,
    { ...defaultState, ...initialState, timeOffset: new Date(serverTime) - new Date() + LATENCY, },
    applyMiddleware(logger)
  )

export default appStore
