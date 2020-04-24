import React from 'react'
import { useSelector } from 'react-redux'
import { Dialog, DialogTitle, List, ListItem, ListItemText } from '@material-ui/core'
import './Timer.scss'

const Timer = ({ organizer, show }) => {
  const timerEndAt = useSelector(state => state.timerEndAt)
  const timeOffset = useSelector(state => state.timeOffset)
  const orchestratorChannel = useSelector(state => state.orchestrator)

  const [displayDurationDialog, setDisplayDurationDialog] = React.useState(false)
  const [remainingTime, setRemainingTime] = React.useState(0)

  React.useEffect(() => {
    // On timer start
    if (timerEndAt) {
      const endTime = new Date(timerEndAt).getTime() - timeOffset
      const intervalId = setInterval(() => {
        const theoricalRemainingTime = (endTime - new Date().getTime()) / 1000
        setRemainingTime(theoricalRemainingTime > 0 ? theoricalRemainingTime : 0)
        if (theoricalRemainingTime === 0) {
          clearInterval(intervalId)
        }
      }, 500)
      return () => clearInterval(intervalId)
    }
  }, [timerEndAt, timeOffset])

  const handleTimerClick = () => {
    if (organizer) {
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

  const displayTimer = organizer || timerEndAt !== null

  if (!show) {
    return null
  }

  return (
    <>
      {displayTimer && <div id='timer' onClick={handleTimerClick}>
        <span>Timer:</span>
        <span className='minutes'>{remainingMinutes < 10 ? '0' : ''}{remainingMinutes}</span>
        <span className='colon-separator'>:</span>
        <span className='seconds'>{remainingSeconds < 10 ? '0' : ''}{remainingSeconds}</span>
      </div>}
      <Dialog onClose={handleClose} aria-labelledby='duration-dialog' open={displayDurationDialog}>
        <DialogTitle id='duration-dialog'>Set duration</DialogTitle>
        <List>
          {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((minutes) => (
            <ListItem button onClick={() => handleListItemClick(minutes * 60)} key={minutes}>
              <ListItemText primary={`${minutes === 10 ? '' : '0'}${minutes}mn`} />
            </ListItem>
          ))}
        </List>
      </Dialog>
    </>
  )
}

export default Timer
