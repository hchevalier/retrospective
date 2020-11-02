import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import consumer from 'channels/consumer'
import { join as joinOrchestratorChannel } from 'channels/orchestratorChannel'

const useWebsocketChannel = () => {
  const dispatch = useDispatch()

  const retrospectiveId = useSelector(state => state.retrospective.id)
  const channel = useSelector(state => state.orchestrator.subscription)

  const handleActionReceived = useCallback((action, data) => {
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
    } else if (action === 'changeAvatar') {
      dispatch({ type: 'change-avatar', participant: data.participant })
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

  useEffect(() => {
    if (!retrospectiveId || !dispatch) return

    console.log('Joining channel')

    const orchestratorChannel = joinOrchestratorChannel({ retrospectiveId: retrospectiveId, onReceivedAction: handleActionReceived })
    dispatch({ type: 'set-channel', subscription: orchestratorChannel })

    return () => {
      if (orchestratorChannel) {
        consumer.subscriptions.remove(orchestratorChannel)
        consumer.disconnect()
        console.log('Leaving channel')
      }
    }
  }, [dispatch, handleActionReceived, retrospectiveId])

  return channel
}

export default useWebsocketChannel
