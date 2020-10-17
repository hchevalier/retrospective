import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import classNames from 'classnames'
import Button from './Button'
import { progressDuration } from './Button.scss'

const FacilitatorToolkitRight = () => {
  const [confirmNext, setConfirmNext] = React.useState(0)
  const { subscription: channel, step } = useSelector(state => state.orchestrator)

  const nextStep = () => {
    if (confirmNext === 1) {
      channel.changeStep()
      setConfirmNext(0)
    }
    else setConfirmNext(1)
  }

  useEffect(() => {
    if (confirmNext === 1) {
      const timeout = setTimeout(() => {
        setConfirmNext(0)
      }, parseInt(progressDuration) * 1000)
      return () => clearTimeout(timeout)
    }
  }, [confirmNext])

  if (step === 'done' || !channel || channel.consumer.connection.disconnected) return null

  return (
    <div className='flex flex-col'>
      <Button primary contained onClick={nextStep} className={classNames('w-16 h-16 ml-5', { 'text-sm progress': confirmNext })}>
        {confirmNext ? 'Confirm' : 'Next'}
      </Button>
    </div>
  )
}

export default FacilitatorToolkitRight
