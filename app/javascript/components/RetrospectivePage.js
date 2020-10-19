import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import consumer from 'channels/consumer'
import { join as joinOrchestratorChannel } from 'channels/orchestratorChannel'
import classNames from 'classnames'
import RetrospectiveArea from './RetrospectiveArea'
import ReflectionsList from './ReflectionsList'
import ReflectionsListForActionStep from './ReflectionsListForActionStep'

const RetrospectivePage = ({ id: retrospectiveId, kind }) => {
  const dispatch = useDispatch()
  const [reflectionsListVisible, setReflectionsListVisible] = useState(true)

  const profile = useSelector(state => state.profile)
  const revealer = useSelector(state => state.profile.revealer)
  const currentStep = useSelector(state => state.orchestrator.step)
  const channel = useSelector(state => state.orchestrator.subscription)
  const zonesTypology = useSelector(state => state.retrospective.zonesTypology)

  const handleActionReceived = React.useCallback((action, data) => {
    if (action === 'newParticipant') {
      dispatch({ type: 'new-participant', newParticipant: data.profile })
    } else if (action === 'refreshParticipant') {
      dispatch({ type: 'refresh-participant', participant: data.participant })
    } else if (action === 'next') {
      dispatch({ type: 'change-step', step: data.next_step, visibleReflections: data.visibleReflections, discussedReflection: data.discussedReflection, visibleReactions: data.visibleReactions, pendingTasks: data.pendingTasks })
    } else if (action === 'setTimer') {
      dispatch({ type: 'start-timer', timerEndAt: data.timer_end_at })
    } else if (action === 'changeColor') {
      dispatch({ type: 'change-color', participant: data.participant, availableColors: data.availableColors })
    } else if (action === 'revealReflection') {
      dispatch({ type: 'reveal-reflection', reflection: data.reflection })
    } else if (action === 'newReaction') {
      dispatch({ type: 'push-reaction', reaction: data.reaction })
    } else if (action === 'dropReaction') {
      dispatch({ type: 'drop-reaction', reactionId: data.reactionId })
    } else if (action === 'setDiscussedReflection') {
      dispatch({ type: 'set-discussed-reflection', reflection: data.reflection })
    } else if (action === 'addTask') {
      dispatch({ type: 'add-task', task: data.task })
    } else if (action === 'updateTask') {
      dispatch({ type: 'change-task', task: data.task })
    } else if (action === 'updatePendingTask') {
      dispatch({ type: 'change-pending-task', task: data.task })
    } else if (action === 'dropTask') {
      dispatch({ type: 'drop-task', taskId: data.taskId })
    } else if (action === 'updateFacilitatorInfo') {
      dispatch({ type: 'update-facilitator-info', facilitatorInfo: data.facilitatorInfo })
    } else if (action === 'changeTopic') {
      if (data.reflection) {
        dispatch({ type: 'change-topic', reflection: data.reflection })
      } else {
        dispatch({ type: 'change-topic', topic: data.topic })
      }
    }
  }, [dispatch])

  React.useEffect(() => {
    if (channel) {
      consumer.subscriptions.remove(channel)
      consumer.disconnect()
    }
    const orchestratorChannel = joinOrchestratorChannel({ retrospectiveId: retrospectiveId, onReceivedAction: handleActionReceived })
    dispatch({ type: 'set-channel', subscription: orchestratorChannel })
  }, [])

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
        <div className={classNames('transition-margin duration-500 ease-in-out', { '-ml-76': isFullScreen() })}>
          <ReflectionsListForActionStep />
        </div> :
        <div className={classNames('transition-margin duration-500 ease-in-out', { '-ml-76': isFullScreen() })}>
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
