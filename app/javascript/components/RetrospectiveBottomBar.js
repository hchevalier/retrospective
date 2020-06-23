import React from 'react'
import { useSelector } from 'react-redux'
import Timer from './Timer'
import PropTypes from 'prop-types'

const RetrospectiveBottomBar = ({ onReflectionFormOpen }) => {
  const profile = useSelector(state => state.profile)
  const organizer = useSelector(state => state.profile.organizer)
  const currentStep = useSelector(state => state.orchestrator.step)
  const orchestratorChannel = useSelector(state => state.orchestrator.subscription)

  const canCreateReflection = () => profile && currentStep === 'thinking'

  const nextStep = () => {
    orchestratorChannel?.send({ intent: 'next' })
  }

  if (currentStep === 'done') {
    return null
  }

  return (
    <div className='flex flex-1 items-end justify-between pb-2'>
      <div className='w-2/12'>
        <Timer show={currentStep === 'thinking'} organizer={organizer} />
      </div>
      {canCreateReflection() && <Button variant='contained' color='primary' onClick={onReflectionFormOpen}>New reflection</Button>}
      {organizer && <Button variant='contained' color='primary' onClick={nextStep}>Next</Button>}
    </div>
  )
}

const Button = ({ children, ...rest }) => (
  <button className='bg-blue-500 focus:outline-none focus:shadow-outline font-medium hover:bg-blue-700 mt-6 px-5 py-1 rounded text-white' {...rest}>
    {children}
  </button>
)

RetrospectiveBottomBar.propTypes = {
  onReflectionFormOpen: PropTypes.func.isRequired
}

export default RetrospectiveBottomBar
