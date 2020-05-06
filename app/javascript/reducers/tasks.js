import { reject, updateArray } from 'lib/helpers/array'

const inititalState = []

const tasks = (state = inititalState, action) => {
  switch (action.type) {
    case 'add-task':
      return [...state, action.task]
    case 'change-task':
      return updateArray(state, action.task, 'id')
    case 'drop-task':
      return reject(state, (task) => task.id == action.taskId)
    default:
      return state
  }
}

export default tasks
