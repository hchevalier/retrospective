import React from 'react'
import Button from '@material-ui/core/Button'

const RetrospectiveBottomBar = ({ profile, channels }) => {
  const nextStep = () => {
    channels.orchestratorChannel.send({ intent: 'next' })
  }

  return (
    <div id='bottom-bar'>
      <div>Timer: 10:00</div>
      {profile && <div>New reflection</div>}
      {profile?.organizer && <Button variant='contained' color='primary' onClick={nextStep}>Next</Button>}
    </div>
  )
}

export default RetrospectiveBottomBar
