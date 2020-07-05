import React from 'react'
import { useSelector } from 'react-redux'
import Button from './Button'

const FacilitatorToolkitRight = () => {
  const { subscription: channel, step } = useSelector(state => state.orchestrator)

  const nextStep = () => {
    channel?.send({ intent: 'next' })
  }

  if (step === 'done') return null

  return (
    <div className='flex flex-row'>
      <Button primary contained onClick={nextStep} className='w-16 h-16 ml-5'>Next</Button>
    </div>
  )
}

export default FacilitatorToolkitRight