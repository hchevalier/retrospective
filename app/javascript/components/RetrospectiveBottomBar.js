import React from 'react'
import { useSelector } from 'react-redux'
import Button from '@material-ui/core/Button'
import Timer from './Timer'

const RetrospectiveBottomBar = ({ onReflectionFormOpen }) => {
  const profile = useSelector(state => state.profile)
  const currentStep = useSelector(state => state.step)
  const orchestratorChannel = useSelector(state => state.orchestrator)

  const canCreateReflection = () => profile && currentStep === 'thinking'
  const organizer = () => profile?.organizer

  const nextStep = () => {
    orchestratorChannel?.send({ intent: 'next' })
  }

  return (
    <div id='bottom-bar'>
      {currentStep === 'thinking' && <Timer organizer={organizer()} />}
      {canCreateReflection() && <Button variant='contained' color='primary' onClick={onReflectionFormOpen}>New reflection</Button>}
      {organizer() && <Button variant='contained' color='primary' onClick={nextStep}>Next</Button>}
    </div>
  )
}

export default RetrospectiveBottomBar
