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
      <Button primary contained onClick={nextStep} additionalClassNames={{ 'w-16': true, 'h-16': true, 'ml-5': true }}>Next</Button>
    </div>
  )
}

export default FacilitatorToolkitRight
