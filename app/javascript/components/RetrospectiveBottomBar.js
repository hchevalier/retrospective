import React from 'react'
import Button from '@material-ui/core/Button'
import Timer from './Timer'

const RetrospectiveBottomBar = ({ profile, channels, currentStep, onReflectionFormOpen }) => {
  const nextStep = () => {
    channels.orchestratorChannel.send({ intent: 'next' })
  }

  const loggedIn = () => !!profile
  const canCreateReflection = () => loggedIn && currentStep === 'thinking'
  const organizer = () => profile?.organizer

  return (
    <div id='bottom-bar'>
      <Timer />
      {canCreateReflection() && <Button variant='contained' color='primary' onClick={onReflectionFormOpen}>New reflection</Button>}
      {organizer() && <Button variant='contained' color='primary' onClick={nextStep}>Next</Button>}
    </div>
  )
}

export default RetrospectiveBottomBar
