import React, { useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import Card from './Card'
import GladSadMad from './retrospectives/GladSadMad'
import Starfish from './retrospectives/Starfish'
import TrafficLights from './retrospectives/TrafficLights'
import OscarsGerards from './retrospectives/OscarsGerards'
import RetrospectiveBottomBar from './RetrospectiveBottomBar'
import Sailboat from './retrospectives/Sailboat'
import FullScreenIcon from 'images/fullscreen-icon'
import ExitFullScreenIcon from 'images/exit-fullscreen-icon'

const StepThinking = ({ kind, fullScreen, onToggleFullScreen }) => {
  const [selectedZone, setSelectedZone] = useState(null)
  const [highlightZones, setHighlightZones] = useState(false)

  const zonesTypology = useSelector(state => state.retrospective.zonesTypology)

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

  let retrospective = <div>Unknown retrospective {kind}</div>
  if (kind === 'glad_sad_mad') {
    retrospective = <GladSadMad highlightZones={highlightZones} onZoneClicked={handleZoneClicked} selectedZone={selectedZone} />
  } else if (kind === 'sailboat') {
    retrospective = <Sailboat highlightZones={highlightZones} onZoneClicked={handleZoneClicked} selectedZone={selectedZone} />
  } else if (kind === 'starfish') {
    retrospective = <Starfish highlightZones={highlightZones} onZoneClicked={handleZoneClicked} selectedZone={selectedZone} />
  } else if (kind === 'traffic_lights') {
    retrospective = <TrafficLights highlightZones={highlightZones} onZoneClicked={handleZoneClicked} selectedZone={selectedZone} />
  } else if (kind === 'oscars_gerards') {
    retrospective = <OscarsGerards highlightZones={highlightZones} onZoneClicked={handleZoneClicked} selectedZone={selectedZone} />
  }

  return (
    <Card
      vertical
      className='pb-0 h-full'
      wrap
      scrollable
      containerClassName='flex-1 px-4 h-full'>
      {zonesTypology === 'open' && (
        <img
          className='cursor-pointer absolute top-2 left-6'
          src={fullScreen ? ExitFullScreenIcon : FullScreenIcon}
          onClick={onToggleFullScreen}
          width="24" />
      )}
      {retrospective}
      <RetrospectiveBottomBar onReflectionReady={handleReflectionReady} onReflectionPending={handleReflectionPending} selectedZone={selectedZone} />
    </Card>
  )
}

StepThinking.propTypes = {
  kind: PropTypes.string,
  fullScreen: PropTypes.bool,
  onToggleFullScreen: PropTypes.func
}

export default StepThinking
