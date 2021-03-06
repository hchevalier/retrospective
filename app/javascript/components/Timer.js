import React from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import Modal from './Modal'
import './Timer.scss'

const computeRemainingTime = endTime => {
  return Math.max((endTime - new Date().getTime()) / 1000, 0)
}

const Timer = ({ facilitator, show }) => {
  const timerEndAt = useSelector(state => state.timer.timerEndAt)
  const timeOffset = useSelector(state => state.timer.timeOffset)
  const orchestratorChannel = useSelector(state => state.orchestrator.subscription)

  const endTime = timerEndAt ? new Date(timerEndAt).getTime() - timeOffset : 0

  const [displayDurationDialog, setDisplayDurationDialog] = React.useState(false)
  const [remainingTime, setRemainingTime] = React.useState(computeRemainingTime(endTime))

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      const theoricalRemainingTime = computeRemainingTime(endTime)
      setRemainingTime(theoricalRemainingTime)
      if (theoricalRemainingTime === 0) {
        clearInterval(intervalId)
      }
    }, 500)
    return () => clearInterval(intervalId)
  }, [endTime])

  const handleTimerClick = () => {
    if (facilitator) {
      setDisplayDurationDialog(true)
    }
  }

  const handleClose = () => {
    setDisplayDurationDialog(false)
  }

  const handleListItemClick = (value) => {
    orchestratorChannel.startTimer(value)
    handleClose()
  }

  const remainingMinutes = Math.floor(remainingTime / 60)
  const remainingSeconds = Math.floor(remainingTime % 60)

  const displayTimer = facilitator || timerEndAt !== null

  if (!show) {
    return null
  }

  return (
    <>
      {displayTimer ? (
        <div id='timer' className='cursor-pointer w-64' onClick={handleTimerClick}>
          <span className='font-medium text-blue-800'>Timer:</span>
          <span className='minutes ml-1 text-xl'>{timerEndAt ? `${remainingMinutes}`.padStart(2, '0') : '--'}</span>
          <span className='colon-separator text-xl'>:</span>
          <span className='seconds text-xl'>{timerEndAt ? `${remainingSeconds}`.padStart(2, '0') : '--'}</span>
        </div>
      ) : <div /> }
      <Modal onClose={handleClose} open={displayDurationDialog}>
        <p className='text-xl'>Set duration</p>
        {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((minutes) => (
          <button className='block hover:bg-blue-100 p-1 text-left w-full' onClick={() => handleListItemClick(minutes * 60)} key={minutes}>
            {`${minutes === 10 ? '' : '0'}${minutes}mn`}
          </button>
        ))}
      </Modal>
    </>
  )
}

Timer.propTypes = {
  facilitator: PropTypes.bool,
  show: PropTypes.bool
}

export default Timer
