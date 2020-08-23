import React, { useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import ColorPicker from './ColorPicker'
import GladSadMad from './retrospectives/GladSadMad'
import Starfish from './retrospectives/Starfish'
import TrafficLights from './retrospectives/TrafficLights'
import RetrospectiveBottomBar from './RetrospectiveBottomBar'
import Sailboat from './retrospectives/Sailboat'
import StepReview from './StepReview'
import StepGrouping from './StepGrouping'
import StepVoting from './StepVoting'
import StepActions from './StepActions'
import StepDone from './StepDone'

const RetrospectiveArea = ({ retrospectiveId, kind }) => {
  const currentStep = useSelector(state => state.orchestrator.step)
  const zonesTypology = useSelector(state => state.retrospective.zonesTypology)

  const [selectedZone, setSelectedZone] = useState(null)
  const [highlightZones, setHighlightZones] = useState(false)

  const handleZoneClicked = (event) => {
    event.stopPropagation()

    if (zonesTypology === 'open') {
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
    }

    return <div>Unknown retrospective {kind}</div>
  }

  return (
    <>
      <div id={kind} className='flex flex-col pt-6 flex-1 px-4'>
        {currentStep === 'gathering' && <ColorPicker retrospectiveId={retrospectiveId} />}
        {currentStep === 'reviewing' && <StepReview />}
        {currentStep === 'thinking' && renderRetrospective()}
        {currentStep === 'grouping' && <StepGrouping />}
        {currentStep === 'voting' && <StepVoting />}
        {currentStep === 'actions' && <StepActions />}
        {currentStep === 'done' && <StepDone />}
      </div>
      <RetrospectiveBottomBar onReflectionReady={handleReflectionReady} onReflectionPending={handleReflectionPending} selectedZone={selectedZone} />
    </>
  )
}

export default RetrospectiveArea
