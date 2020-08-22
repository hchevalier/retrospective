import { updateArray } from 'lib/helpers/array'

const initialGroupState = {
  pendingTasks: []
}

const group = (state = initialGroupState, action) => {
  switch (action.type) {
    case 'change-step': {
      return { ...state, pendingTasks: action.pendingTasks || [] }
    }
    case 'change-pending-task':
      return { ...state, pendingTasks: updateArray(state.pendingTasks, action.task, 'id') }
    default:
      return state
  }
}

export default group
