import { createStore, applyMiddleware } from 'redux'
import { initialState as defaultRetrospectiveState } from 'reducers/retrospective'
import reducer from 'reducers'
import logger from 'redux-logger'

const LATENCY = 200

const appStore = ({ serverTime, participants, profile, ...initialState }) => {
  return createStore(
    reducer,
    {
      retrospective: {
        ...defaultRetrospectiveState, ...initialState, timeOffset: new Date(serverTime) - new Date() + LATENCY
      },
      participants,
      profile
    },
    applyMiddleware(logger)
  )
}
export default appStore
