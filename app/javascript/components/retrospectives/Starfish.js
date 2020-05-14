import React from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import PropTypes from 'prop-types'
import Zone from './Zone'
import Icon from '../Icon'

const Starfish = ({ mode, onZoneClicked }) => {
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
        mode={mode}
        icon={<Icon retrospectiveKind='starfish' zone='Keep' />}
        reflections={reflections.filter((reflection) => reflection.zone.id === keep.id)}
        onClick={onZoneClicked} />
      <Zone
        reference={start}
        mode={mode}
        icon={<Icon retrospectiveKind='starfish' zone='Start' />}
        reflections={reflections.filter((reflection) => reflection.zone.id === start.id)}
        onClick={onZoneClicked} />
      <Zone
        reference={stop}
        mode={mode}
        icon={<Icon retrospectiveKind='starfish' zone='Stop' />}
        reflections={reflections.filter((reflection) => reflection.zone.id === stop.id)}
        onClick={onZoneClicked} />
      <Zone
        reference={more}
        mode={mode}
        icon={<Icon retrospectiveKind='starfish' zone='More' />}
        reflections={reflections.filter((reflection) => reflection.zone.id === more.id)}
        onClick={onZoneClicked} />
      <Zone
        reference={less}
        mode={mode}
        icon={<Icon retrospectiveKind='starfish' zone='Less' />}
        reflections={reflections.filter((reflection) => reflection.zone.id === less.id)}
        onClick={onZoneClicked} />
    </>
  )
}

Starfish.propTypes = {
  mode: PropTypes.string.isRequired,
  onZoneClicked: PropTypes.func.isRequired
}

export default Starfish
