import React from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import Card from './Card'
import StickyNote from './StickyNote'
import StickyBookmark from './StickyBookmark'
import VoteCorner from './VoteCorner'
import Task from './Task'
import InlineTopic from './InlineTopic'
import TrafficLightResult from './retrospectives/traffic_lights/TrafficLightResult'

const StepDone = () => {
  const zonesTypology = useSelector(state => state.retrospective.zonesTypology)
  const visibleReflections = useSelector(state => state.reflections.visibleReflections, shallowEqual)
  const initialDiscussedReflection = useSelector(state => state.reflections.discussedReflection)
  const [currentReflection, setCurrentReflection] = React.useState(initialDiscussedReflection)
  const [displayAllTasks, setDisplayAllTasks] = React.useState(true)
  const visibleReactions = useSelector(state => state.reactions.visibleReactions, shallowEqual)
  const tasks = useSelector(state => state.tasks, shallowEqual)

  const reactionsForReflection = (reflection) => visibleReactions.filter((reaction) => {
    return reaction.targetId === `Reflection-${reflection.id}` || reaction.targetId === `Topic-${reflection.topic?.id}`
  })

  const reflectionsWithVotes = visibleReflections.map((reflection) => {
    const reactions = visibleReactions.filter((reaction) => {
      return reaction.targetId === `Reflection-${reflection.id}` || reaction.targetId === `Topic-${reflection.topic?.id}`
    })
    const votes = reactions.filter((reaction) => reaction.kind === 'vote')
    return [reflection, votes]
  }).sort((a, b) => b[1].length - a[1].length)

  const handleStickyBookmarkClicked = (reflection) => setCurrentReflection(reflection)

  const handleDisplayTasksChange = (event) => { setDisplayAllTasks(!event.target.checked) }

  if (!currentReflection) return null

  const displayedReflections =
    currentReflection.topic ?
      visibleReflections.filter((reflection) => reflection.topic?.id == currentReflection.topic.id) :
      [currentReflection]

  const topics = {}

  return (
    <div className='flex flex-row h-full'>
      <div className='flex w-1/3 flex-col screen-limited overflow-y-scroll'>
        <Card vertical title='All topics' containerClassName='h-full'>
          <div id='reflections-list' className='w-full'>
            {['open', 'limited'].includes(zonesTypology) && reflectionsWithVotes.map(([reflection, votes], index) => {
              if (reflection.topic?.id && !topics[reflection.topic.id]) {
                topics[reflection.topic.id] = reflection.topic
                return <InlineTopic
                  key={reflection.topic.id}
                  reflection={reflection}
                  allReflections={visibleReflections}
                  reactions={visibleReactions}
                  selectedReflection={currentReflection}
                  onItemClick={handleStickyBookmarkClicked} />
              } else if (!reflection.topic?.id) {
                let selected = reflection.id == currentReflection.id ? 'shadow-md mt-2' : 'mx-2 mt-2'
                return (
                  <StickyBookmark key={index} color={reflection.color} otherClassNames={selected} onClick={() => handleStickyBookmarkClicked(reflection)}>
                    <VoteCorner target={reflection} targetType={'reflection'} votes={votes} inline noStandOut /> <span>{reflection.content}</span>
                  </StickyBookmark>
                )
              }
            })}
            {zonesTypology === 'single_choice' && reflectionsWithVotes.map(([reflection]) => {
              return <TrafficLightResult key={reflection.id} reflection={reflection} onClick={() => handleStickyBookmarkClicked(reflection)} />
            })}
          </div>
        </Card>
      </div>
      <div className='flex w-1/3 flex-col screen-limited overflow-y-scroll'>
        <Card vertical title='Selected topic' containerClassName='h-full'>
          <div id='discussed-reflection' className='w-64'>
            {['open', 'limited'].includes(zonesTypology) && displayedReflections.map((reflection) => {
              return <StickyNote key={reflection.id} reflection={reflection} showReactions showVotes reactions={reactionsForReflection(reflection)} />
            })}
            {zonesTypology === 'single_choice' && displayedReflections.map((reflection) => {
              return <TrafficLightResult key={reflection.id} reflection={reflection} />
            })}
          </div>
        </Card>
      </div>
      <div className='flex w-1/3 flex-col screen-limited overflow-y-scroll'>
        <Card vertical title='Actions' containerClassName='h-full'>
          <div id='tasks-list'>
            <input id='all-tasks' type='checkbox' name='all_tasks' onChange={handleDisplayTasksChange} />
            <label htmlFor='all-tasks'>Only display tasks for current reflection</label>
            {tasks.filter((task) => {
              return (
                displayAllTasks ||
                task.reflection.id === currentReflection.id ||
                (currentReflection.topic && task.reflection.topicId === currentReflection.topic.id)
              )
            }).map((task, index) => <Task key={index} task={task} readOnly />)}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default StepDone
