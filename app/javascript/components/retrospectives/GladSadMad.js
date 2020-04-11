import React from 'react'
import { useSelector } from 'react-redux'
import Zone from './Zone'
import Glad from '../../images/glad.png'
import Sad from '../../images/sad.png'
import Mad from '../../images/mad.png'

const GladSadMad = ({ mode, onZoneClicked }) => {
  const reflections = useSelector(state => state.ownReflections)
  const zones = useSelector(state => state.retrospective.zones)

  const glad = zones.find((zone) => zone.name === 'Glad')
  const sad = zones.find((zone) => zone.name === 'Sad')
  const mad = zones.find((zone) => zone.name === 'Mad')

  return (
    <>
      <Zone reference={glad} mode={mode} icon={Glad} reflections={reflections.filter((reflection) => reflection.zone.id === glad.id)} onClick={onZoneClicked} />
      <Zone reference={sad} mode={mode} icon={Sad} reflections={reflections.filter((reflection) => reflection.zone.id === sad.id)} onClick={onZoneClicked} />
      <Zone reference={mad} mode={mode} icon={Mad} reflections={reflections.filter((reflection) => reflection.zone.id === mad.id)} onClick={onZoneClicked} />
    </>
  )
}

export default GladSadMad
