import { reject, updateArray } from 'lib/helpers/array'

const initialState = {
  ownReflections: [],
  visibleReflections: [],
  discussedReflection: null
}

const reflections = (state = initialState, action) => {
  let ownReflections = state.ownReflections
  switch (action.type) {
    case 'change-step': {
      const reflections = action.visibleReflections?.length > 0 ? action.visibleReflections : state.visibleReflections
      return { ...state, visibleReflections: reflections, discussedReflection: action.discussedReflection }
    }
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
    default:
      return state;
  }
}

export default reflections
