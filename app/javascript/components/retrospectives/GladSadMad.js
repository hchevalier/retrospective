import React from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import Zone from './Zone'
import Icon from '../Icon'

const GladSadMad = ({ mode, onZoneClicked }) => {
  const reflections = useSelector(state => state.ownReflections, shallowEqual)
  const zones = useSelector(state => state.retrospective.zones, shallowEqual)

  const glad = zones.find((zone) => zone.name === 'Glad')
  const sad = zones.find((zone) => zone.name === 'Sad')
  const mad = zones.find((zone) => zone.name === 'Mad')

  return (
    <>
      <Zone
        reference={glad}
        mode={mode}
        icon={<Icon retrospectiveKind='glad_sad_mad' zone='Glad' />}
        reflections={reflections.filter((reflection) => reflection.zone.id === glad.id)}
        onClick={onZoneClicked} />
      <Zone
        reference={sad}
        mode={mode}
        icon={<Icon retrospectiveKind='glad_sad_mad' zone='Sad' />}
        reflections={reflections.filter((reflection) => reflection.zone.id === sad.id)}
        onClick={onZoneClicked} />
      <Zone
        reference={mad}
        mode={mode}
        icon={<Icon retrospectiveKind='glad_sad_mad' zone='Mad' />}
        reflections={reflections.filter((reflection) => reflection.zone.id === mad.id)}
        onClick={onZoneClicked} />
    </>
  )
}

export default GladSadMad
