const profile = (state = {}, action) => {
  switch (action.type) {
    case 'login':
      return action.profile;
    case 'change-color':
    case 'refresh-participant':
      if (state.uuid === action.participant.uuid)
        return action.participant
      else
        return state
    default:
      return state
  }
}
export default profile
