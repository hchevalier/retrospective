import { reject } from 'lib/helpers/array'

export const initialState = {
  allColors: [],
  availableColors: [],
  retrospective: null,
  zones: [],
  step: '',
  ownReflections: [],
  visibleReflections: [],
  discussedReflection: null,
  ownReactions: [],
  visibleReactions: [],
  orchestrator: null,
  timeOffset: 0,
  timerEndAt: null,
  tasks: []
}

const retrospective = (state = initialState, action) => {
  let ownReflections = state.ownReflections

  switch (action.type) {
    case 'change-step': {
      const reflections = action.visibleReflections?.length > 0 ? action.visibleReflections : state.visibleReflections
      const reactions = action.visibleReactions?.length > 0 ? action.visibleReactions : state.visibleReactions
      return { ...state, step: action.step, visibleReflections: reflections, discussedReflection: action.discussedReflection, visibleReactions: reactions }
    }
    case 'set-channel':
      return { ...state, orchestrator: action.subscription }
    case 'add-reflection':
      return { ...state, ownReflections: [...state.ownReflections, action.reflection] }
    case 'reveal-reflection':
      ownReflections = updateArray(ownReflections, action.reflection, 'id')
      return { ...state, visibleReflections: [...state.visibleReflections, action.reflection], ownReflections: ownReflections }
    case 'change-reflection':
      ownReflections = updateArray(ownReflections, action.reflection, 'id')
      return { ...state, ownReflections: ownReflections }
    case 'delete-reflection':
      return { ...state, ownReflections: reject(state.ownReflections, (reflection) => reflection.id === action.reflectionId) }
    case 'set-discussed-reflection':
      return { ...state, discussedReflection: action.reflection }
    case 'add-reaction':
      return { ...state, ownReactions: [...state.ownReactions, action.reaction] }
    case 'push-reaction':
      return { ...state, visibleReactions: [...state.visibleReactions, action.reaction] }
    case 'drop-reaction':
      return { ...state, visibleReactions: reject(state.visibleReactions, (reaction) => reaction.id == action.reactionId) }
    case 'delete-reaction':
      return { ...state, ownReactions: reject(state.ownReactions, (reaction) => reaction.id == action.reactionId) }
    case 'add-task':
      return { ...state, tasks: [...state.tasks, action.task] }
    case 'change-task':
      return { ...state, tasks: updateArray(state.tasks, action.task, 'id') }
    case 'drop-task':
      return { ...state, tasks: reject(state.tasks, (task) => task.id == action.taskId) }
    case 'start-timer':
      return { ...state, timerEndAt: action.timerEndAt }
    default:
      return state
  }
}

const updateArray = (array, newItem, attribute) => {
  return array.map(item => item[attribute] === newItem[attribute] ? newItem : item)
}

export default retrospective
