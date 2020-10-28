import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import useWebsocketChannel from 'lib/hooks/useWebsocketChannel'
import RetrospectiveArea from './RetrospectiveArea'
import ReflectionsList from './ReflectionsList'
import ReflectionsListForActionStep from './ReflectionsListForActionStep'
import './RetrospectivePage.scss'

const RetrospectivePage = ({ id: retrospectiveId, kind }) => {
  const [reflectionsListVisible, setReflectionsListVisible] = useState(true)

  const channel = useWebsocketChannel()

  const profile = useSelector(state => state.profile)
  const revealer = useSelector(state => state.profile.revealer)
  const currentStep = useSelector(state => state.orchestrator.step)
  const zonesTypology = useSelector(state => state.retrospective.zonesTypology)

  const shouldDisplayReflectionsList = (currentStep === 'thinking' && zonesTypology === 'open') || currentStep === 'grouping' || currentStep === 'actions'

  const handleReflectionsListToggle = () => {
    if (!revealer || !reflectionsListVisible) {
      setReflectionsListVisible(!reflectionsListVisible)
    }
  }

  const handleReflectionsListClose = React.useCallback(() => {
    if (revealer && channel) {
      channel.dropRevealerToken()
    }

    setReflectionsListVisible(false)
  }, [channel, revealer])

  const isFullScreen = () => {
    if (!shouldDisplayReflectionsList) return true

    if (currentStep === 'actions')
      return !reflectionsListVisible && !revealer && !profile?.facilitator

    return !reflectionsListVisible && !revealer
  }

  return (
    <div className='flex flex-row flex-1 w-full relative'>
      {shouldDisplayReflectionsList && (currentStep === 'actions' ?
        <div className={classNames('transition-margin duration-500 ease-in-out', { '-ml-72': isFullScreen() })}>
          <ReflectionsListForActionStep />
        </div> :
        <div className={classNames('transition-margin duration-500 ease-in-out', { '-ml-72': isFullScreen() })}>
          <ReflectionsList retrospectiveKind={kind} onDone={handleReflectionsListClose} />
        </div>
      )}
      <div className='flex flex-col flex-1 overflow-x-hidden'>
        <div id='right-panel' className='flex flex-col flex-1 relative my-4'>
          <RetrospectiveArea retrospectiveId={retrospectiveId} kind={kind} onToggleFullScreen={handleReflectionsListToggle} fullScreen={isFullScreen()} />
        </div>
      </div>
    </div>
  )
}

RetrospectivePage.propTypes = {
  id: PropTypes.string.isRequired,
  group: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  kind: PropTypes.string.isRequired
}

export default RetrospectivePage
