import React from 'react'
import { Dialog, DialogTitle, List, ListItem, ListItemText } from '@material-ui/core'
import './Timer.scss'

const Timer = ({ organizer, remainingTime, orchestratorChannel }) => {
  const [displayDurationDialog, setDisplayDurationDialog] = React.useState(false)

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

  return (
    <>
      <div id='timer' onClick={handleTimerClick}>
        <span>Timer:</span>
        <span>{remainingMinutes < 10 ? '0' : ''}{remainingMinutes}</span>
        <span className='colon-separator'>:</span>
        <span>{remainingSeconds < 10 ? '0' : ''}{remainingSeconds}</span>
      </div>
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
