import React, { useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import Card from './Card'
import GladSadMad from './retrospectives/GladSadMad'
import PlusMinusInteresting from './retrospectives/PlusMinusInteresting'
import FourL from './retrospectives/FourL'
import Starfish from './retrospectives/Starfish'
import Timeline from './retrospectives/Timeline'
import TrafficLights from './retrospectives/TrafficLights'
import OscarsGerards from './retrospectives/OscarsGerards'
import RetrospectiveBottomBar from './RetrospectiveBottomBar'
import Sailboat from './retrospectives/Sailboat'
import FullScreenIcon from 'images/fullscreen-icon'
import ExitFullScreenIcon from 'images/exit-fullscreen-icon'

const RETROSPECTIVE_KINDS = {
  'glad_sad_mad': GladSadMad,
  'pmi': PlusMinusInteresting,
  'four_l': FourL,
  'sailboat': Sailboat,
  'starfish': Starfish,
  'timeline': Timeline,
  'traffic_lights': TrafficLights,
  'oscars_gerards': OscarsGerards,
}

const StepThinking = ({ kind, fullScreen, onToggleFullScreen }) => {
  const [selectedZone, setSelectedZone] = useState(null)
  const [highlightZones, setHighlightZones] = useState(false)

  const zonesTypology = useSelector(state => state.retrospective.zonesTypology)

  const handleZoneClicked = (event) => {
    event.stopPropagation()

    if (zonesTypology === 'open' || zonesTypology === 'limited') {
      setSelectedZone((event.target.closest('.zone') || event.target).dataset.id)
    }
  }

  const handleReflectionPending = useCallback(() => {
    setHighlightZones(false)
    setSelectedZone(null)
  }, [])

  const handleReflectionReady = useCallback(() => {
    setHighlightZones(true)
  }, [])

  const RetrospectiveComponent = RETROSPECTIVE_KINDS[kind]
  const retrospective = RetrospectiveComponent ?
    <RetrospectiveComponent highlightZones={highlightZones} onZoneClicked={handleZoneClicked} selectedZone={selectedZone} /> :
    <div>Unknown retrospective {kind}</div>

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
