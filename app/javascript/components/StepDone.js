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

  const renderTopic = (reflection) => {
    const reflectionsInTopic = reflectionsWithVotes.filter(([otherReflection]) => otherReflection.topic?.id === reflection.topic.id)
    const reflectionIds = reflectionsInTopic.map(([otherReflection]) => otherReflection.id)
    const votesInTopic = visibleReactions.filter((reaction) => {
      return reflectionIds.includes(reaction.targetId.split(/-(.+)?/, 2)[1]) || reaction.targetId === `Topic-${reflection.topic.id}`
    }).filter((reaction) => reaction.kind === 'vote')
    let selected = reflectionIds.includes(currentReflection.id) ? 'shadow-md' : 'mx-2'
    return (
      <div key={reflection.topic.id}>
        <StickyBookmark color={'whitesmoke'} otherClassNames={selected} onClick={() => handleStickyBookmarkClicked(reflection)}>
          <VoteCorner target={reflection.reflection} targetType={'topic'} votes={votesInTopic} inline noStandOut /> <span>{reflection.topic.label}</span>
        </StickyBookmark>
        {reflectionsInTopic.map(([otherReflection]) => {
          return (
            <StickyBookmark key={otherReflection.id} color={otherReflection.color} otherClassNames={'ml-8'} onClick={() => handleStickyBookmarkClicked(otherReflection)}>
              {otherReflection.content}
            </StickyBookmark>
          )
        })}
      </div>
    )
  }

  if (!currentReflection) return null

  const topics = {}

  return (
    <div id='actions-zone'>
      <div id='reflections-panel'>
        <div id='discussed-reflection'>
          <StickyNote reflection={currentReflection} showVotes reactions={relevantReactions} />
        </div>
        <div id='reflections-list'>
          {reflectionsWithVotes.map(([reflection, votes], index) => {
            if (reflection.topic?.id && !topics[reflection.topic.id]) {
              topics[reflection.topic.id] = reflection.topic
              return renderTopic(reflection)
            } else if (!reflection.topic?.id) {
              let selected = reflection.id == currentReflection.id ? 'shadow-md' : 'mx-2'
              return (
                <StickyBookmark key={index} color={reflection.color} otherClassNames={selected} onClick={() => handleStickyBookmarkClicked(reflection)}>
                  <VoteCorner target={reflection} targetType={'reflection'} votes={votes} inline noStandOut /> <span>{reflection.content}</span>
                </StickyBookmark>
              )
            }
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

export default StepDone
