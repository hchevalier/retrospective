import { combineReducers } from 'redux'
import participants from './participants'
import retrospective from './retrospective'
import profile from './profile'

export default combineReducers({
  participants, retrospective, profile
})
