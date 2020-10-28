import React from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import StickyNote from './StickyNote'
import ActionEditor from './ActionEditor'
import TooltipToggler from './TooltipToggler'
import TrafficLightResult from './retrospectives/traffic_lights/TrafficLightResult'
import Card from './Card'

const StepActions = () => {
  const currentReflection = useSelector(state => state.reflections.discussedReflection)
  const visibleReflections = useSelector(state => state.reflections.visibleReflections, shallowEqual)
  const visibleReactions = useSelector(state => state.reactions.visibleReactions, shallowEqual)
  const zonesTypology = useSelector(state => state.retrospective.zonesTypology)
  const facilitator = useSelector(state => state.profile.facilitator)

  const reactionsForReflection = (reflection) => visibleReactions.filter((reaction) => {
    return reaction.targetId === `Reflection-${reflection.id}` ||  reaction.targetId === `Topic-${reflection.topic?.id}`
  })

  if (!currentReflection) return null

  const displayedReflections =
    currentReflection.topic ?
      visibleReflections.filter((reflection) => reflection.topic?.id == currentReflection.topic.id) :
      [currentReflection]

  const tooltipContent = (
    <>
      {facilitator && <div>Click on a reflection on the left to select it as the new discussed reflection</div>}
      {!facilitator && <div>You can discuss the reflections your facilitator selects</div>}
    </>
  )

  return (
    <div className='flex flex-row'>
      <div className='flex w-2/3 flex-col'>
        <Card vertical title='Discussed topic'>
          <div className='text-center text-xs text-gray-800'>
            <TooltipToggler content={tooltipContent} /> Hover the question mark to display instructions for this step
          </div>
          <div id='discussed-reflections-panel' className='p-4 w-full flex flex-row justify-evenly'>
            <div id='discussed-reflection' className='flex flex-col'>
              {['open', 'limited'].includes(zonesTypology) && displayedReflections.map((reflection) => {
                return <StickyNote key={reflection.id} reflection={reflection} showReactions showVotes reactions={reactionsForReflection(reflection)} />
              })}
              {zonesTypology === 'single_choice' && displayedReflections.map((reflection) => {
                return <TrafficLightResult key={reflection.id} reflection={reflection} />
              })}
            </div>
          </div>
        </Card>
      </div>
      <div className='flex w-1/3 flex-col screen-limited overflow-y-scroll'>
        <ActionEditor reflectionId={currentReflection.id} reflectionContent={currentReflection.content} />
      </div>
    </div>
  )
}

export default StepActions
