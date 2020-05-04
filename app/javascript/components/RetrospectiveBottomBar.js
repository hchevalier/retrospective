import React from 'react'
import { useSelector } from 'react-redux'
import Button from '@material-ui/core/Button'
import Timer from './Timer'
import PropTypes from 'prop-types'

const RetrospectiveBottomBar = ({ onReflectionFormOpen }) => {
  const profile = useSelector(state => state.profile)
  const organizer = useSelector(state => state.profile.organizer)
  const currentStep = useSelector(state => state.retrospective.step)
  const orchestratorChannel = useSelector(state => state.retrospective.orchestrator)

  const canCreateReflection = () => profile && currentStep === 'thinking'

  const nextStep = () => {
    orchestratorChannel?.send({ intent: 'next' })
  }

  if (currentStep === 'done') {
    return null
  }

  return (
    <div id='bottom-bar'>
      {<Timer show={currentStep === 'thinking'} organizer={organizer} />}
      {canCreateReflection() && <Button variant='contained' color='primary' onClick={onReflectionFormOpen}>New reflection</Button>}
      {organizer && <Button variant='contained' color='primary' onClick={nextStep}>Next</Button>}
    </div>
  )
}

RetrospectiveBottomBar.propTypes = {
  onReflectionFormOpen: PropTypes.func.isRequired
}

export default RetrospectiveBottomBar
