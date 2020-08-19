import React from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import TrafficLightZone from './traffic_lights/TrafficLightZone'

const TrafficLights = () => {
  const reflections = useSelector(state => state.reflections.ownReflections, shallowEqual)
  const zones = useSelector(state => state.retrospective.zones, shallowEqual)

  const support = zones.find((zone) => zone.name === 'Support')
  const teamWork = zones.find((zone) => zone.name === 'Team work')
  const mission = zones.find((zone) => zone.name === 'Mission')
  const codebase = zones.find((zone) => zone.name === 'Codebase')
  const process = zones.find((zone) => zone.name === 'Process')
  const value = zones.find((zone) => zone.name === 'Value')
  const learning = zones.find((zone) => zone.name === 'Learning')
  const ticketFlow = zones.find((zone) => zone.name === 'Ticket flow')
  const fun = zones.find((zone) => zone.name === 'Fun')
  const influence = zones.find((zone) => zone.name === 'Influence')

  return (
    <div style={{ height: '430px', display: 'flex', flexWrap: 'wrap' }}>
      <TrafficLightZone
        reference={support}
        value={reflections.find((reflection) => reflection.zone.id === support.id)?.content} />

      <TrafficLightZone
        reference={teamWork}
        value={reflections.find((reflection) => reflection.zone.id === teamWork.id)?.content} />

      <TrafficLightZone
        reference={mission}
        value={reflections.find((reflection) => reflection.zone.id === mission.id)?.content} />

      <TrafficLightZone
        reference={codebase}
        value={reflections.find((reflection) => reflection.zone.id === codebase.id)?.content} />

      <TrafficLightZone
        reference={process}
        value={reflections.find((reflection) => reflection.zone.id === process.id)?.content} />

      <TrafficLightZone
        reference={value}
        value={reflections.find((reflection) => reflection.zone.id === value.id)?.content} />

      <TrafficLightZone
        reference={learning}
        value={reflections.find((reflection) => reflection.zone.id === learning.id)?.content} />

      <TrafficLightZone
        reference={ticketFlow}
        value={reflections.find((reflection) => reflection.zone.id === ticketFlow.id)?.content} />

      <TrafficLightZone
        reference={fun}
        value={reflections.find((reflection) => reflection.zone.id === fun.id)?.content} />

      <TrafficLightZone
        reference={influence}
        value={reflections.find((reflection) => reflection.zone.id === influence.id)?.content} />
    </div>
  )
}

export default TrafficLights
