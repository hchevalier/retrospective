import { createStore } from 'redux'
import rootReducer from 'reducers/root_reducer'

const initialState = {
  profile: null,
  participants: [],
  step: '',
  ownReflections: [],
  channels: {}
}

const appStore = (railsState) => createStore(rootReducer, { ...initialState, ...railsState })

export default appStore
