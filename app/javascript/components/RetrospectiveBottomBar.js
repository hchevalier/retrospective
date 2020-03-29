import React from 'react'
import Button from '@material-ui/core/Button'

const RetrospectiveBottomBar = ({ organizer, channels }) => {
  const nextStep = () => {
    channels.orchestratorChannel.send({ intent: 'next' })
  }

  return (
    <div>
      <div>Timer: 10:00</div>
      <div>New reflection</div>
      {organizer && <Button variant='contained' color='primary' onClick={nextStep}>Next</Button>}
    </div>
  )
}

export default RetrospectiveBottomBar
