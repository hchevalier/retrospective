import React from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import { uniqBy } from 'lib/helpers/array'
import RandomIcon from 'images/random-icon.svg'

const FacilitatorToolkit = () => {
  const channel = useSelector(state => state.orchestrator.subscription)
  const step = useSelector(state => state.orchestrator.step)
  const visibleReflections = useSelector(state => state.reflections.visibleReflections, shallowEqual)
  const participants = useSelector(state => state.participants, shallowEqual)

  const revealers = uniqBy(visibleReflections.map((reflection) => reflection.owner), 'uuid').map(participant => participant.uuid)

  const pickRandomRevealer = () => {
    let remainingParticipants = participants.filter(participant => !revealers.includes(participant.uuid))
    const randomRevealer = remainingParticipants[Math.floor(Math.random() * remainingParticipants.length)]
    channel.setRevealer(randomRevealer.uuid)
  }

  return (
    <div className='flex flex-column'>
      {step === 'grouping' && revealers.length < participants.length && (
        <button
          className='bg-blue-400 focus:outline-none focus:shadow-outline font-medium hover:bg-blue-600 h-8 w-8 mr-2 rounded text-white cursor-pointer'
          color='primary'
          onClick={pickRandomRevealer}>
            <img className='mx-auto w-6' src={RandomIcon} />
          </button>
      )}
    </div>
  )
}

export default FacilitatorToolkit
