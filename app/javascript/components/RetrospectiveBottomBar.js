import React from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import Timer from './Timer'
import BlankStickyNote from './BlankStickyNote'

const RetrospectiveBottomBar = (delegatedProps) => {
  const profile = useSelector(state => state.profile)
  const currentStep = useSelector(state => state.orchestrator.step)
  const zonesTypology = useSelector(state => state.retrospective.zonesTypology)
  const facilitator = profile.facilitator

  const canCreateReflection = () => profile && currentStep === 'thinking' && zonesTypology === 'open'

  if (currentStep === 'done') {
    return null
  }

  return (
    <div className='flex sticky items-end justify-between pb-2 overflow-y-hidden' style={{ top: 'calc(100vh - 30px)' }}>
      <div className='w-2/12'>
        <Timer show={currentStep === 'thinking'} facilitator={facilitator} />
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
