import React from 'react'
import Zone from './Zone'

const GladSadMad = ({ profile, channels, reflections, mode, zones, onZoneClicked }) => {
  const glad = zones.find((zone) => zone.name === 'Glad')
  const sad = zones.find((zone) => zone.name === 'Sad')
  const mad = zones.find((zone) => zone.name === 'Mad')

  return (
    <>
      <Zone reference={glad} mode={mode} reflections={reflections.filter((reflection) => reflection.zone.id === glad.id)} onClick={onZoneClicked} />
      <Zone reference={sad} mode={mode} reflections={reflections.filter((reflection) => reflection.zone.id === sad.id)} onClick={onZoneClicked} />
      <Zone reference={mad} mode={mode} reflections={reflections.filter((reflection) => reflection.zone.id === mad.id)} onClick={onZoneClicked} />
    </>
  )
}

export default GladSadMad
