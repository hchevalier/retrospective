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

  const canCreateReflection = () => profile && currentStep === 'thinking' && (zonesTypology === 'open' || zonesTypology === 'limited')

  if (currentStep === 'done') {
    return null
  }

  return (
    <div className='flex flex-row self-end justify-between w-full absolute pl-12 bottom-0'>
      <Timer show={currentStep === 'thinking'} facilitator={facilitator} />
      {canCreateReflection() && (
        <BlankStickyNote ownerProfile={profile} {...delegatedProps} />
      )}
    </div>
  )
}

RetrospectiveBottomBar.propTypes = {
  onReflectionReady: PropTypes.func.isRequired,
  onReflectionPending: PropTypes.func.isRequired,
  selectedZone: PropTypes.string
}

export default RetrospectiveBottomBar
