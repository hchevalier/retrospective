import React from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import Timer from './Timer'
import BlankStickyNote from './BlankStickyNote'

const RetrospectiveBottomBar = (delegatedProps) => {
  const profile = useSelector(state => state.profile)
  const currentStep = useSelector(state => state.orchestrator.step)
  const organizer = profile.organizer

  const canCreateReflection = () => profile && currentStep === 'thinking'

  if (currentStep === 'done') {
    return null
  }

  return (
    <div className='flex flex-1 items-end justify-between pb-2 overflow-y-hidden'>
      <div className='w-2/12'>
        <Timer show={currentStep === 'thinking'} organizer={organizer} />
      </div>
      {canCreateReflection() && <BlankStickyNote ownerProfile={profile} {...delegatedProps} />}
    </div>
  )
}

RetrospectiveBottomBar.propTypes = {
  onReflectionReady: PropTypes.func.isRequired,
  onReflectionPending: PropTypes.func.isRequired,
  selectedZone: PropTypes.string
}

export default RetrospectiveBottomBar
