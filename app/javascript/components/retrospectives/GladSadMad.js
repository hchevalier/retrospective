import React from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import PropTypes from 'prop-types'
import Zone from './Zone'
import Icon from '../Icon'

const GladSadMad = ({ highlightZones, onZoneClicked }) => {
  const reflections = useSelector(state => state.reflections.ownReflections, shallowEqual)
  const zones = useSelector(state => state.retrospective.zones, shallowEqual)

  const glad = zones.find((zone) => zone.name === 'Glad')
  const sad = zones.find((zone) => zone.name === 'Sad')
  const mad = zones.find((zone) => zone.name === 'Mad')

  return (
    <>
      <Zone
        reference={glad}
        highlight={highlightZones}
        icon={<Icon retrospectiveKind='glad_sad_mad' zone='Glad' dataAttributes={{ 'data-id': glad.id }} onClick={onZoneClicked} />}
        reflections={reflections.filter((reflection) => reflection.zone.id === glad.id)}
        onClick={onZoneClicked} />
      <Zone
        reference={sad}
        highlight={highlightZones}
        icon={<Icon retrospectiveKind='glad_sad_mad' zone='Sad' dataAttributes={{ 'data-id': sad.id }} onClick={onZoneClicked} />}
        reflections={reflections.filter((reflection) => reflection.zone.id === sad.id)}
        onClick={onZoneClicked} />
      <Zone
        reference={mad}
        highlight={highlightZones}
        icon={<Icon retrospectiveKind='glad_sad_mad' zone='Mad' dataAttributes={{ 'data-id': mad.id }} onClick={onZoneClicked} />}
        reflections={reflections.filter((reflection) => reflection.zone.id === mad.id)}
        onClick={onZoneClicked} />
    </>
  )
}

GladSadMad.propTypes = {
  highlightZones: PropTypes.bool,
  onZoneClicked: PropTypes.func.isRequired
}

export default GladSadMad
