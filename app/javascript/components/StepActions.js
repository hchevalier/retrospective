import React from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import StickyNote from './StickyNote'
import ActionEditor from './ActionEditor'
import TrafficLightResult from './retrospectives/traffic_lights/TrafficLightResult'
import './StepActions.scss'

const StepActions = () => {
  const currentReflection = useSelector(state => state.reflections.discussedReflection)
  const visibleReflections = useSelector(state => state.reflections.visibleReflections, shallowEqual)
  const visibleReactions = useSelector(state => state.reactions.visibleReactions, shallowEqual)
  const zonesTypology = useSelector(state => state.retrospective.zonesTypology)

  const reactionsForReflection = (reflection) => visibleReactions.filter((reaction) => {
    return reaction.targetId === `Reflection-${reflection.id}` ||  reaction.targetId === `Topic-${reflection.topic?.id}`
  })

  if (!currentReflection) return null


  const displayedReflections =
    currentReflection.topic ?
      visibleReflections.filter((reflection) => reflection.topic?.id == currentReflection.topic.id) :
      [currentReflection]

  return (
    <div id='actions-zone'>
      <div id='discussed-reflections-panel'>
        <div id='discussed-reflection' className='flex flex-col'>
          {['open', 'limited'].includes(zonesTypology) && displayedReflections.map((reflection) => {
            return <StickyNote key={reflection.id} reflection={reflection} showReactions showVotes reactions={reactionsForReflection(reflection)} />
          })}
          {zonesTypology === 'single_choice' && displayedReflections.map((reflection) => {
            return <TrafficLightResult key={reflection.id} reflection={reflection} />
          })}
        </div>
      </div>
      <div id='action-editor-container' className='items-start'>
        <ActionEditor reflectionId={currentReflection.id} reflectionContent={currentReflection.content} />
      </div>
    </div>
  )
}

export default StepActions
