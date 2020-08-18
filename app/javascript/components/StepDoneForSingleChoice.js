import React from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import Task from './Task'
import TrafficLightResult from './retrospectives/traffic_lights/TrafficLightResult'
import './StepActions.scss'

const StepDoneForSingleChoice = () => {
  const visibleReflections = useSelector(state => state.reflections.visibleReflections, shallowEqual)
  const initialDiscussedReflection = useSelector(state => state.reflections.discussedReflection)
  const [currentReflection, setCurrentReflection] = React.useState(initialDiscussedReflection)
  const [displayAllTasks, setDisplayAllTasks] = React.useState(true)
  const visibleReactions = useSelector(state => state.reactions.visibleReactions, shallowEqual)
  const tasks = useSelector(state => state.tasks, shallowEqual)

  const reflectionsWithVotes = visibleReflections.map((reflection) => {
    const reactions = visibleReactions.filter((reaction) => reaction.targetId === `Reflection-${reflection.id}`)
    const votes = reactions.filter((reaction) => reaction.kind === 'vote')
    return [reflection, votes]
  }).sort((a, b) => b[1].length - a[1].length)

  const handleZoneClicked = (reflection) => setCurrentReflection(reflection)

  const handleDisplayTasksChange = (event) => { setDisplayAllTasks(!event.target.checked) }

  if (!currentReflection) return null

  return (
    <div id='actions-zone'>
      <div id='reflections-panel'>
        <div id='discussed-reflection'>
          <TrafficLightResult reflection={currentReflection} />
        </div>
        <div id='reflections-list'>
          {reflectionsWithVotes.map(([reflection, votes], index) => {
            let selected = reflection.id == currentReflection.id ? 'shadow-md' : 'mx-2'
            return (
              <TrafficLightResult key={reflection.id} reflection={reflection} onClick={() => handleZoneClicked(reflection)} />
            )
          })}
        </div>
      </div>
      <div id='tasks-list'>
        <input id='all-tasks' type='checkbox' name='all_tasks' onChange={handleDisplayTasksChange} />
        <label htmlFor='all-tasks'>Only display tasks for current reflection</label>
        {tasks.filter((task) => displayAllTasks || task.reflection.id === currentReflection.id).map((task, index) => <Task key={index} task={task} readOnly />)}
      </div>
    </div>
  )
}

export default StepDoneForSingleChoice
