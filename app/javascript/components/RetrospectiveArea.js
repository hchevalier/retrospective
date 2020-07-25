import React, { useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import ColorPicker from './ColorPicker'
import GladSadMad from './retrospectives/GladSadMad'
import Starfish from './retrospectives/Starfish'
import RetrospectiveBottomBar from './RetrospectiveBottomBar'
import Sailboat from './retrospectives/Sailboat'
import StepReview from './StepReview'
import StepGrouping from './StepGrouping'
import StepVoting from './StepVoting'
import StepActions from './StepActions'
import StepDone from './StepDone'

const RetrospectiveArea = ({ retrospectiveId, kind, groupId }) => {
  const currentStep = useSelector(state => state.orchestrator.step)

  const [selectedZone, setSelectedZone] = useState(null)
  const [highlightZones, setHighlightZones] = useState(false)

  const handleZoneClicked = (event) => {
    event.stopPropagation()

    setSelectedZone(event.target.dataset.id)
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
    }

    return <div>Unknown retrospective {kind}</div>
  }

  return (
    <>
      <div className='flex flex-col flex-1 px-4 overflow-y-scroll'>
        {currentStep === 'gathering' && <ColorPicker retrospectiveId={retrospectiveId} />}
        {currentStep === 'reviewing' && <StepReview groupId={groupId} />}
        {currentStep === 'thinking' && renderRetrospective()}
        {currentStep === 'grouping' && <StepGrouping />}
        {currentStep === 'voting' && <StepVoting />}
        {currentStep === 'actions' && <StepActions />}
        {currentStep === 'done' && <StepDone />}
        <RetrospectiveBottomBar onReflectionReady={handleReflectionReady} onReflectionPending={handleReflectionPending} selectedZone={selectedZone} />
      </div>
    </>
  )
}

export default RetrospectiveArea
