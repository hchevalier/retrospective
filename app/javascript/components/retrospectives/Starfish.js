import React from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import PropTypes from 'prop-types'
import Zone from './Zone'
import Icon from '../Icon'

const Starfish = ({ highlightZones, onZoneClicked }) => {
  const reflections = useSelector(state => state.reflections.ownReflections, shallowEqual)
  const zones = useSelector(state => state.retrospective.zones, shallowEqual)

  const keep = zones.find((zone) => zone.name === 'Keep')
  const start = zones.find((zone) => zone.name === 'Start')
  const stop = zones.find((zone) => zone.name === 'Stop')
  const more = zones.find((zone) => zone.name === 'More')
  const less = zones.find((zone) => zone.name === 'Less')

  return (
    <>
      <Zone
        reference={keep}
        highlight={highlightZones}
        icon={<Icon retrospectiveKind='starfish' zone='Keep' dataAttributes={{ 'data-id': keep.id }} onClick={onZoneClicked} />}
        reflections={reflections.filter((reflection) => reflection.zone.id === keep.id)}
        onClick={onZoneClicked} />
      <Zone
        reference={start}
        highlight={highlightZones}
        icon={<Icon retrospectiveKind='starfish' zone='Start' dataAttributes={{ 'data-id': start.id }} onClick={onZoneClicked} />}
        reflections={reflections.filter((reflection) => reflection.zone.id === start.id)}
        onClick={onZoneClicked} />
      <Zone
        reference={stop}
        highlight={highlightZones}
        icon={<Icon retrospectiveKind='starfish' zone='Stop' dataAttributes={{ 'data-id': stop.id }} onClick={onZoneClicked} />}
        reflections={reflections.filter((reflection) => reflection.zone.id === stop.id)}
        onClick={onZoneClicked} />
      <Zone
        reference={more}
        highlight={highlightZones}
        icon={<Icon retrospectiveKind='starfish' zone='More' dataAttributes={{ 'data-id': more.id }} onClick={onZoneClicked} />}
        reflections={reflections.filter((reflection) => reflection.zone.id === more.id)}
        onClick={onZoneClicked} />
      <Zone
        reference={less}
        highlight={highlightZones}
        icon={<Icon retrospectiveKind='starfish' zone='Less' dataAttributes={{ 'data-id': less.id }} onClick={onZoneClicked} />}
        reflections={reflections.filter((reflection) => reflection.zone.id === less.id)}
        onClick={onZoneClicked} />
    </>
  )
}

Starfish.propTypes = {
  highlightZones: PropTypes.bool,
  onZoneClicked: PropTypes.func.isRequired
}

export default Starfish
