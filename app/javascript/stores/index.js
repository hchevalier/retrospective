import { createStore, applyMiddleware } from 'redux'
import reducer from 'reducers'
import logger from 'redux-logger'

const LATENCY = 200

const appStore = (props) => {
  const {
    serverTime, participants, profile, ownReactions,
    visibleReactions, timerEndAt, tasks, pendingTasks, retrospective,
    ownReflections, visibleReflections, discussedReflection, facilitatorInfo,
    ...initialState
  } = props

  return createStore(
    reducer,
    {
      orchestrator: { ...initialState, facilitatorInfo },
      participants,
      profile,
      reactions: { visibleReactions, ownReactions },
      reflections: { ownReflections, visibleReflections: visibleReflections || [], discussedReflection },
      retrospective: { ...retrospective },
      tasks,
      group: { pendingTasks },
      timer: { timerEndAt, timeOffset: new Date(serverTime) - new Date() + LATENCY }
    },
    applyMiddleware(logger)
  )
}
export default appStore
