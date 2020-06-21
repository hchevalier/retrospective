import React from 'react'
import { Provider, useSelector, useDispatch } from 'react-redux'
import appStore from 'stores'
import consumer from 'channels/consumer'
import { join as joinOrchestratorChannel } from 'channels/orchestratorChannel'
import { uniqBy } from 'lib/helpers/array'
import RetrospectiveArea from './RetrospectiveArea'
import ParticipantsList from './ParticipantsList'
import FacilitatorToolkit from './FacilitatorToolkit'
import ReflectionsList from './ReflectionsList'
import LoginForm from './LoginForm'
import './RetrospectiveLobby.scss'
import HomeIcon from 'images/home-icon.svg'

const copyUrlToClipboard = () => {
  const toCopy = document.createElement('span')
  toCopy.setAttribute('type', 'hidden')
  toCopy.appendChild(document.createTextNode(window.location.href))
  document.body.appendChild(toCopy);
  const range = document.createRange()
  const selection = window.getSelection()

  range.selectNodeContents(toCopy)
  selection.removeAllRanges()
  selection.addRange(range)
  document.execCommand('copy')
  selection.removeAllRanges()

  toCopy.remove()
  alert('Copied invite URL to clipboard')
}

const RetrospectiveLobby = ({ id: retrospectiveId, name, kind }) => {
  const dispatch = useDispatch()
  const profile = useSelector(state => state.profile)
  const channel = useSelector(state => state.orchestrator.subscription)
  const loggedIn = !!profile.uuid

  const handleActionReceived = React.useCallback((action, data) => {
    if (action === 'newParticipant') {
      dispatch({ type: 'new-participant', newParticipant: data.profile })
    } else if (action === 'refreshParticipant') {
      dispatch({ type: 'refresh-participant', participant: data.participant })
    } else if (action === 'next') {
      dispatch({ type: 'change-step', step: data.next_step, visibleReflections: data.visibleReflections, discussedReflection: data.discussedReflection, visibleReactions: data.visibleReactions })
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
    } else if (action === 'dropTask') {
      dispatch({ type: 'drop-task', taskId: data.taskId })
    } else if (action === 'updateOrganizerInfo') {
      dispatch({ type: 'update-organizer-info', organizerInfo: data.organizerInfo })
    } else if (action === 'changeTopic') {
      dispatch({ type: 'change-topic', reflection: data.reflection })
    }
  }, [dispatch])

  React.useEffect(() => {
    if (channel) {
      consumer.subscriptions.remove(channel)
      consumer.disconnect()
    }
    const orchestratorChannel = joinOrchestratorChannel({ retrospectiveId: retrospectiveId, onReceivedAction: handleActionReceived })
    dispatch({ type: 'set-channel', subscription: orchestratorChannel })
  }, [loggedIn])

  return (
    <div id='main-container'>
      <nav className="bg-gray-900 mb-6 shadow text-white" role="navigation">
        <div className="container mx-auto p-4 flex flex-wrap items-center md:flex-no-wrap">
          <div className="mr-4 md:mr-8">
            <a href='/'>
              <img src={HomeIcon} width="24" />
            </a>
          </div>
          <div className="mr-4 md:mr-8">
            Lobby {name} - {kind}
          </div>
          <div className='flex flex-grow justify-end'>
            <ParticipantsList />
            <FacilitatorToolkit />
          </div>
        </div>
      </nav>
      <div className="px-6">
        <div className='grid grid-cols-3'>
          <ReflectionsList />
        </div>
        <div className='grid grid-cols-9'>
          {!loggedIn && <LoginForm retrospectiveId={retrospectiveId} />}
          {loggedIn && <RetrospectiveArea retrospectiveId={retrospectiveId} kind={kind} />}
        </div>
      </div>
    </div>
  )
}

const RetrospectiveLobbyWithProvider = (props) => {
  const store = appStore({ ...props.initialState, retrospective: props.retrospective })

  return (
    <Provider store={store}>
      <RetrospectiveLobby {...props.retrospective} />
    </Provider>
  )
}

export default RetrospectiveLobbyWithProvider
