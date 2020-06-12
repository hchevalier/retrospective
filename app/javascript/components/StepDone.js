import React from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import StickyNote from './StickyNote'
import StickyBookmark from './StickyBookmark'
import VoteCorner from './VoteCorner'
import Task from './Task'
import './StepActions.scss'

const StepDone = () => {
  const visibleReflections = useSelector(state => state.reflections.visibleReflections, shallowEqual)
  const initialDiscussedReflection = useSelector(state => state.reflections.discussedReflection)
  const [currentReflection, setCurrentReflection] = React.useState(initialDiscussedReflection)
  const [displayAllTasks, setDisplayAllTasks] = React.useState(true)
  const visibleReactions = useSelector(state => state.reactions.visibleReactions, shallowEqual)
  const tasks = useSelector(state => state.tasks, shallowEqual)

  const relevantReactions = visibleReactions.filter((reaction) => reaction.targetId === `Reflection-${currentReflection.id}`)

  const reflectionsWithVotes = visibleReflections.map((reflection) => {
    const reactions = visibleReactions.filter((reaction) => reaction.targetId === `Reflection-${reflection.id}`)
    const votes = reactions.filter((reaction) => reaction.kind === 'vote')
    return [reflection, votes]
  }).sort((a, b) => b[1].length - a[1].length)

  const handleStickyBookmarkClicked = (reflection) => setCurrentReflection(reflection)

  const handleDisplayTasksChange = (event) => { setDisplayAllTasks(!event.target.checked) }

  if (!currentReflection) return null

  return (
    <div id='actions-zone'>
      <div id='reflections-panel'>
        <div id='discussed-reflection'>
          <StickyNote reflection={currentReflection} showVotes reactions={relevantReactions} />
        </div>
        <div id='reflections-list'>
          {reflectionsWithVotes.map(([reflection, votes], index) => {
            return (
              <StickyBookmark key={index} color={reflection.color} onClick={() => handleStickyBookmarkClicked(reflection)}>
                <VoteCorner reflection={reflection} votes={votes} inline noStandOut /> <span>{reflection.content}</span>
              </StickyBookmark>
            )
          })}
        </div>
      </div>
      <div id='tasks-list'>
        <input type='checkbox' name='all_tasks' onChange={handleDisplayTasksChange} /> Only display tasks for current reflection
        {tasks.filter((task) => displayAllTasks || task.reflection.id === currentReflection.id).map((task, index) => <Task key={index} task={task} readOnly />)}
      </div>
    </div>
  )
}

export default StepDone
