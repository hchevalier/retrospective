import React from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import ActionEditor from './ActionEditor'
import './StepActions.scss'
import TrafficLightResult from './retrospectives/traffic_lights/TrafficLightResult'

const StepActionsForSingleChoice = () => {
  const { facilitator } = useSelector(state => state.profile)
  const visibleReflections = useSelector(state => state.reflections.visibleReflections, shallowEqual)
  const currentReflection = useSelector(state => state.reflections.discussedReflection)
  const visibleReactions = useSelector(state => state.reactions.visibleReactions, shallowEqual)
  const channel = useSelector(state => state.orchestrator.subscription)

  const reflectionsWithVotes = visibleReflections.map((reflection) => {
    const reactions = visibleReactions.filter((reaction) => {
      return reaction.targetId === `Reflection-${reflection.id}` || reaction.targetId === `Topic-${reflection.topic?.id}`
    })
    const votes = reactions.filter((reaction) => reaction.kind === 'vote')
    return [reflection, votes]
  }).sort((a, b) => b[1].length - a[1].length)

  const handleZoneClicked = React.useCallback((reflection) => {
    if (facilitator) {
      channel.changeDiscussedReflection(reflection.id)
    }
  }, [facilitator, channel])

  if (!currentReflection) return null

  return (
    <div id='actions-zone'>
      <div id='reflections-panel'>
        <div id='discussed-reflection'>
          <TrafficLightResult reflection={currentReflection} />
        </div>
        <div id='reflections-list'>
          {reflectionsWithVotes.map(([reflection, votes]) => {
            let selected = reflection.id == currentReflection.id ? 'shadow-md' : 'mx-2'
            return (
              <TrafficLightResult key={reflection.id} reflection={reflection} onClick={() => handleZoneClicked(reflection)} />
            )
          })}
        </div>
      </div>
      <div id='action-editor-container' className='items-start'>
        <ActionEditor reflectionId={currentReflection.id} reflectionContent={currentReflection.content} />
      </div>
    </div>
  )
}

export default StepActionsForSingleChoice
