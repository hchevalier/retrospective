import { reject } from 'lib/helpers/array'

export const initialReactionsState = {
  ownReactions: [],
  visibleReactions: []
}

const reactions = (state = initialReactionsState, action) => {
  switch (action.type) {
    case 'change-step': {
      const reactions = action.visibleReactions?.length > 0 ? action.visibleReactions : state.visibleReactions
      return { ...state, visibleReactions: reactions }
    }
    case 'add-reaction':
      return { ...state, ownReactions: [...state.ownReactions, action.reaction] }
    case 'push-reaction':
      return { ...state, visibleReactions: [...state.visibleReactions, action.reaction] }
    case 'drop-reaction':
      return { ...state, visibleReactions: reject(state.visibleReactions, (reaction) => reaction.id == action.reactionId) }
    case 'delete-reaction':
      return { ...state, ownReactions: reject(state.ownReactions, (reaction) => reaction.id == action.reactionId) }
    default:
      return state
  }
}

export default reactions
