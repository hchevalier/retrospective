import { createStore, applyMiddleware } from 'redux'
import reducer from 'reducers'
import logger from 'redux-logger'

const LATENCY = 200

const appStore = (props) => {
  const {
    serverTime, participants, profile, ownReactions,
    visibleReactions, timerEndAt, tasks, retrospective,
    ownReflections, visibleReflections, discussedReflection,
    ...initialState
  } = props
  return createStore(
    reducer,
    {
      orchestrator: { ...initialState },
      participants,
      profile,
      reactions: { visibleReactions, ownReactions },
      reflections: { ownReflections, visibleReflections: visibleReflections || [], discussedReflection },
      retrospective: { ...retrospective, },
      tasks,
      timer: { timerEndAt, timeOffset: new Date(serverTime) - new Date() + LATENCY }
    },
    applyMiddleware(logger)
  )
}
export default appStore
