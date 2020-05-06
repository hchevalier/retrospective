import { uniqBy } from 'lib/helpers/array'

const initialState = []

const participants = (state = initialState, action) => {

  switch (action.type) {
    case 'login':
      return uniqBy([action.profile, ...participants], 'uuid')
    case 'new-participant':
      return uniqBy([...state, action.newParticipant], 'uuid')
    case 'refresh-participant':
    case 'change-color':
      return updateArray(state, action.participant, 'uuid')
    default:
      return state
  }
}

const updateArray = (array, newItem, attribute) => {
  return array.map(item => item[attribute] === newItem[attribute] ? newItem : item)
}

export default participants
