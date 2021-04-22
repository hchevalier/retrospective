import { uniqBy } from 'lib/helpers/array'

const initialState = []

const participants = (state = initialState, action) => {
  switch (action.type) {
    case 'login':
      return uniqBy([action.profile, ...state], 'uuid')
    case 'new-participant':
      return uniqBy([...state, action.newParticipant], 'uuid')
    case 'change-step': {
      return action.participants ? [...action.participants] : state
    }
    case 'refresh-participant':
    case 'change-color':
    case 'change-avatar':
      return updateArray(state, action.participant, 'uuid')
    default:
      return state
  }
}

const updateArray = (array, newItem, attribute) => {
  return array.map(item => item[attribute] === newItem[attribute] ? newItem : item)
}

export default participants
