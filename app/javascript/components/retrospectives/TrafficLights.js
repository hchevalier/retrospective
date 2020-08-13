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
        hint={'We always get support and help when we ask for it'}
        value={reflections.find((reflection) => reflection.zone.id === support.id)?.content} />

      <TrafficLightZone
        reference={teamWork}
        hint={'We are a strong team and collaborate well together'}
        value={reflections.find((reflection) => reflection.zone.id === teamWork.id)?.content} />

      <TrafficLightZone
        reference={mission}
        hint={'We know why we are here, are aligned with it and excited about it'}
        value={reflections.find((reflection) => reflection.zone.id === mission.id)?.content} />

      <TrafficLightZone
        reference={codebase}
        hint={'We are proud of the quality of our code. It is clean, easy to read and has sufficient test coverage'}
        value={reflections.find((reflection) => reflection.zone.id === codebase.id)?.content} />

      <TrafficLightZone
        reference={process}
        hint={'Our way of working fits us perfectly'}
        value={reflections.find((reflection) => reflection.zone.id === process.id)?.content} />

      <TrafficLightZone
        reference={value}
        hint={'We are proud of what we deliver and our end users feel the same.'}
        value={reflections.find((reflection) => reflection.zone.id === value.id)?.content} />

      <TrafficLightZone
        reference={learning}
        hint={'We are learning interesting stuff all the time'}
        value={reflections.find((reflection) => reflection.zone.id === learning.id)?.content} />

      <TrafficLightZone
        reference={ticketFlow}
        hint={'We get stuff done without useless waiting or delays. Releasing is simple, safe and painless'}
        value={reflections.find((reflection) => reflection.zone.id === ticketFlow.id)?.content} />

      <TrafficLightZone
        reference={fun}
        hint={'We love going to work and have great fun working together'}
        value={reflections.find((reflection) => reflection.zone.id === fun.id)?.content} />

      <TrafficLightZone
        reference={influence}
        hint={'We are in control of our roadmap, we can intervene in decision process regarding what to build and how to build it'}
        value={reflections.find((reflection) => reflection.zone.id === influence.id)?.content} />
    </div>
  )
}

export default TrafficLights
