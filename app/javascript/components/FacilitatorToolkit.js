import React from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import { uniqBy } from 'lib/helpers/array'

const FacilitatorToolkit = () => {
  const profile = useSelector(state => state.profile)
  const channel = useSelector(state => state.orchestrator.subscription)
  const step = useSelector(state => state.orchestrator.step)
  const visibleReflections = useSelector(state => state.reflections.visibleReflections, shallowEqual)
  const participants = useSelector(state => state.participants, shallowEqual)

  const revealers = uniqBy(visibleReflections.map((reflection) => reflection.owner), 'uuid').map(reflection => reflection.uuid)

  const pickRandomRevealer = () => {
    let remainingParticipants = participants.filter(participant => !revealers.includes(participant.uuid))
    const randomRevealer = remainingParticipants[Math.floor(Math.random() * remainingParticipants.length)]
    channel.setRevealer(randomRevealer.uuid)
  }

  return (
    <div className='flex flex-column'>
      {profile?.organizer && step === 'grouping' && revealers.length < participants.length && (
        <button
          className='bg-blue-400 focus:outline-none focus:shadow-outline font-medium hover:bg-blue-600 mt-6 px-5 py-1 rounded text-white'
          color='primary' onClick={pickRandomRevealer}>
          Random revealer
        </button>
      )}
      {revealers.length >= participants.length && (
        <p>Everyone has revealed!</p>
      )}
    </div>
  )
}

export default FacilitatorToolkit
