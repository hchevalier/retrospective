import { combineReducers } from 'redux'
import orchestrator from './orchestrator'
import participants from './participants'
import profile from './profile'
import reactions from './reactions'
import reflections from './reflections'
import retrospective from './retrospective'
import tasks from './tasks'
import timer from './timer'

export default combineReducers({
  orchestrator, participants, profile, reactions, reflections, retrospective, tasks, timer
})
