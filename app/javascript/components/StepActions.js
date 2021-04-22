import React from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import { Line } from 'react-chartjs-2'
import PropTypes from 'prop-types'
import StickyNote from './StickyNote'
import ActionEditor from './ActionEditor'
import TooltipToggler from './TooltipToggler'
import TrafficLightResult from './retrospectives/traffic_lights/TrafficLightResult'
import Card from './Card'
import Button from './Button'
import IconArrow from 'images/arrow-right-icon.inline.svg'

const CHART_SETTINGS = {
  animations: false,
  maintainAspectRatio: false,
  elements: { line: { spanGaps: true } },
  scales: {
    x: {
      grid: {
        drawBorder: false,
      },
    },
    y: {
      min: 0.5,
      max: 4.5,
      grid: {
        drawBorder: false,
        color: (context) => context.tick.value >= 1 && context.tick.value <= 4 ? 'lightgray' : 'transparent',
      },
      ticks: {
        stepSize: 1,
        callback: (val, index) => index === 0 || index === 5 ? '' : val,
      },
    },
  },
}

const LineChart = ({ currentZoneId }) => {
  const participants = useSelector(state => state.participants)
  const zones = useSelector(state => state.retrospective.zones)

  const data = {
    labels: zones.map((zone) => zone.name),
    datasets: participants.map((participant) => {
      return {
        label: participant.surname,
        data: zones.map((zone) => (participant.retrospectiveData || { emotions: {} }).emotions[zone.id]),
        fill: false,
        borderColor: zones.map(() => participant.color),
        pointBorderColor: zones.map((zone) => zone.id === currentZoneId ? '#000000' : 'transparent'),
        backgroundColor: zones.map(() => participant.color),
      }
    })
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '150px' }}>
      <Line data={data} options={CHART_SETTINGS} height={150} />
    </div>
  )
}

LineChart.propTypes = {
  currentZoneId: PropTypes.number.isRequired
}

const StepActions = () => {
  const currentReflection = useSelector(state => state.reflections.discussedReflection)
  const visibleReflections = useSelector(state => state.reflections.visibleReflections, shallowEqual)
  const visibleReactions = useSelector(state => state.reactions.visibleReactions, shallowEqual)
  const { kind, zonesTypology } = useSelector(state => state.retrospective)
  const facilitator = useSelector(state => state.profile.facilitator)
  const channel = useSelector(state => state.orchestrator.subscription)

  const reactionsForReflection = (reflection) => visibleReactions.filter((reaction) => {
    return reaction.targetId === `Reflection-${reflection.id}` ||  reaction.targetId === `Topic-${reflection.topic?.id}`
  })

  const eligibleNavigation = (targetReflection) => !targetReflection.topic || targetReflection.topic.id !== currentReflection.topic?.id

  const reflectionsWithVotes = visibleReflections.map((reflection) => {
    const reactions = visibleReactions.filter((reaction) => {
      return reaction.targetId === `Reflection-${reflection.id}` || reaction.targetId === `Topic-${reflection.topic?.id}`
    })
    const votes = reactions.filter((reaction) => reaction.kind === 'vote')
    return [reflection, votes]
  }).sort((a, b) => b[1].length - a[1].length)

  if (!currentReflection) return null

  const displayedReflections =
    currentReflection.topic ?
      visibleReflections.filter((reflection) => reflection.topic?.id == currentReflection.topic.id) :
      [currentReflection]

  const currentReflectionIndex = reflectionsWithVotes.findIndex(([reflection]) => reflection.id === currentReflection.id)
  const nextReflection = reflectionsWithVotes.find(([reflection], index) => index > currentReflectionIndex && eligibleNavigation(reflection))
  const previousReflection = reflectionsWithVotes.filter(([reflection], index) => index < currentReflectionIndex && eligibleNavigation(reflection)).pop()

  const handleNavigateToPreviousReflection = () => {
    if (previousReflection) channel.changeDiscussedReflection(previousReflection[0].id)
  }

  const handleNavigateToNextReflection = () => {
    if (nextReflection) channel.changeDiscussedReflection(nextReflection[0].id)
  }

  const tooltipContent = (
    <>
      {facilitator && <div>Click on a reflection in the left panel to select it as the new discussed reflection<br />or navigate using the arrow buttons</div>}
      {!facilitator && <div>You can discuss the reflections your facilitator selects</div>}
    </>
  )

  return (
    <div className='flex flex-row h-full'>
      <div className='flex w-2/3 flex-col'>
        {kind === 'timeline' && (
          <Card containerClassName='screen-limited mb-3'>
            <LineChart currentZoneId={displayedReflections[0].zone.id} />
          </Card>
        )}
        <Card vertical title='Discussed topic' containerClassName='h-full screen-limited'>
          <div className='text-center text-xs text-gray-800'>
            <TooltipToggler content={tooltipContent} /> Hover the question mark to display instructions for this step
          </div>
          {['open', 'limited'].includes(zonesTypology) && (
            <div className='p-4 w-full flex flex-col text-center'>
              <span className='font-medium'>{displayedReflections[0].zone.name}</span>
            </div>
          )}
          <div id='discussed-reflections-panel' className='p-4 w-full flex flex-row justify-between'>
            {facilitator && channel?.ready() && (
              <Button name='previous_topic' contained primary className='px-4 max-h-16' onClick={handleNavigateToPreviousReflection} disabled={!previousReflection}>
                <IconArrow className='w-6 h-6 transform rotate-180' />
              </Button>
            )}
            <div id='discussed-reflection' className='flex flex-col w-64'>
              {['open', 'limited'].includes(zonesTypology) && displayedReflections.map((reflection) => {
                return <StickyNote key={reflection.id} reflection={reflection} showReactions showVotes reactions={reactionsForReflection(reflection)} />
              })}
              {zonesTypology === 'single_choice' && displayedReflections.map((reflection) => {
                return <TrafficLightResult key={reflection.id} reflection={reflection} />
              })}
            </div>
            {facilitator && channel?.ready() && (
              <Button name='next_topic' contained primary className='px-4 max-h-16' onClick={handleNavigateToNextReflection} disabled={!nextReflection}>
                <IconArrow className='w-6 h-6' />
              </Button>
            )}
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
