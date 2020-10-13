import React from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import { uniqBy } from 'lib/helpers/array'
import Button from './Button'
import RandomIcon from 'images/random-icon.svg'

const FacilitatorToolkitLeft = () => {
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

  if (!channel || channel.consumer.connection.disconnected) return null

  return (
    <div className='flex flex-col'>
      {step === 'grouping' && revealers.length < participants.length && (
        <Button id='assign-random-revealer' className='w-8 h-8' primary contained onClick={pickRandomRevealer}>
          <img className='mx-auto w-6' src={RandomIcon} />
        </Button>
      )}
    </div>
  )
}

export default FacilitatorToolkitLeft
