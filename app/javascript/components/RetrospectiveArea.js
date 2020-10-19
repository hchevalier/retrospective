import React, { useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import GladSadMad from './retrospectives/GladSadMad'
import Starfish from './retrospectives/Starfish'
import TrafficLights from './retrospectives/TrafficLights'
import OscarsGerards from './retrospectives/OscarsGerards'
import RetrospectiveBottomBar from './RetrospectiveBottomBar'
import Sailboat from './retrospectives/Sailboat'
import StepGathering from './StepGathering'
import StepReview from './StepReview'
import StepGrouping from './StepGrouping'
import StepVoting from './StepVoting'
import StepActions from './StepActions'
import StepDone from './StepDone'
import Card from './Card'
import TopicExpanded from './TopicExpanded'
import FullScreenIcon from 'images/fullscreen-icon'
import ExitFullScreenIcon from 'images/exit-fullscreen-icon'

const RetrospectiveArea = ({ kind, onToggleFullScreen, fullScreen }) => {
  const currentStep = useSelector(state => state.orchestrator.step)
  const zonesTypology = useSelector(state => state.retrospective.zonesTypology)

  const [selectedZone, setSelectedZone] = useState(null)
  const [highlightZones, setHighlightZones] = useState(false)
  const [expandedTopic, setExpandedTopic] = useState(null)
  const [forceTopicEditing, setForceTopicEditing] = useState(false)

  const handleZoneClicked = (event) => {
    event.stopPropagation()

    if (zonesTypology === 'open' || zonesTypology === 'limited') {
      setSelectedZone(event.target.dataset.id)
    }
  }

  const handleReflectionPending = useCallback(() => {
    setHighlightZones(false)
    setSelectedZone(null)
  }, [])

  const handleReflectionReady = useCallback(() => {
    setHighlightZones(true)
  }, [])

  const renderRetrospective = () => {
    if (kind === 'glad_sad_mad') {
      return <GladSadMad highlightZones={highlightZones} onZoneClicked={handleZoneClicked} selectedZone={selectedZone} />
    } else if (kind === 'sailboat') {
      return <Sailboat highlightZones={highlightZones} onZoneClicked={handleZoneClicked} selectedZone={selectedZone} />
    } else if (kind === 'starfish') {
      return <Starfish highlightZones={highlightZones} onZoneClicked={handleZoneClicked} selectedZone={selectedZone} />
    } else if (kind === 'traffic_lights') {
      return <TrafficLights highlightZones={highlightZones} onZoneClicked={handleZoneClicked} selectedZone={selectedZone} />
    } else if (kind === 'oscars_gerards') {
      return <OscarsGerards highlightZones={highlightZones} onZoneClicked={handleZoneClicked} selectedZone={selectedZone} />
    }

    return <div>Unknown retrospective {kind}</div>
  }

  const handleExpandTopic = (topic, forceEditing = false) => {
    setExpandedTopic(topic)
    setForceTopicEditing(forceEditing)
  }

  const handleCollapseTopic = () => {
    setExpandedTopic(null)
    setForceTopicEditing(false)
  }

  return (
    <div id={kind} className='h-full'>
      <Card
        vertical
        className='pb-0 h-full'
        wrap={currentStep === 'thinking'}
        scrollable={currentStep === 'thinking'}
        containerClassName='flex-1 px-4 h-full'>
        {['thinking', 'grouping'].includes(currentStep) && zonesTypology === 'open' && (
          <img
            className='cursor-pointer absolute top-2 left-6'
            src={fullScreen ? ExitFullScreenIcon : FullScreenIcon}
            onClick={onToggleFullScreen}
            width="24" />
        )}
        {currentStep === 'gathering' && <StepGathering />}
        {currentStep === 'reviewing' && <StepReview />}
        {currentStep === 'thinking' && renderRetrospective()}
        {currentStep === 'grouping' && <StepGrouping onExpandTopic={handleExpandTopic} />}
        {currentStep === 'voting' && <StepVoting onExpandTopic={handleExpandTopic} />}
        {currentStep === 'actions' && <StepActions />}
        {currentStep === 'done' && <StepDone />}
        <RetrospectiveBottomBar onReflectionReady={handleReflectionReady} onReflectionPending={handleReflectionPending} selectedZone={selectedZone} />
      </Card>
      {expandedTopic && <TopicExpanded topic={expandedTopic} editable={currentStep === 'grouping'} forceTopicEditing={forceTopicEditing} onCollapseTopic={handleCollapseTopic} onTopicChange={handleExpandTopic} />}
    </div>
  )
}

export default RetrospectiveArea
