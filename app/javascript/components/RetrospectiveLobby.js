import React from 'react'
import { Provider, useSelector, useDispatch } from 'react-redux'
import appStore from 'stores/app_store'
import { join as joinOrchestratorChannel } from 'channels/orchestratorChannel'
import RetrospectiveArea from './RetrospectiveArea'
import ParticipantsList from './ParticipantsList'
import LoginForm from './LoginForm'
import './RetrospectiveLobby.scss'

const RetrospectiveLobby = ({ id: retrospectiveId, name, kind }) => {
  const dispatch = useDispatch()

  const loggedIn = useSelector(state => !!state.profile)

  React.useEffect(() => {
    const orchestratorChannel = joinOrchestratorChannel({ retrospectiveId: retrospectiveId, onReceivedAction: handleActionReceived })
    dispatch({ type: 'set-channel', subscription: orchestratorChannel })
  }, [])

  const handleActionReceived = React.useCallback((action, data) => {
    if (action === 'newParticipant') {
      dispatch({ type: 'new-participant', newParticipant: data.profile })
    } else if (action === 'refreshParticipant') {
      dispatch({ type: 'refresh-participant', participant: data.participant })
    } else if (action === 'next') {
      dispatch({ type: 'change-step', step: data.next_step, visibleReflections: data.visibleReflections, discussedReflection: data.discussedReflection })
    } else if (action === 'setTimer' && loggedIn) {
      dispatch({ type: 'start-timer', duration: data.duration })
    } else if (action === 'changeColor') {
      dispatch({ type: 'change-color', participant: data.participant, availableColors: data.availableColors })
    } else if (action === 'revealReflection') {
      dispatch({ type: 'reveal-reflection', reflection: data.reflection })
    } else if (action == 'newReaction') {
      dispatch({ type: 'push-reaction', reaction: data.reaction })
    } else if (action == 'dropReaction') {
      dispatch({ type: 'drop-reaction', reactionId: data.reactionId })
    } else if (action == 'setDiscussedReflection') {
      dispatch({ type: 'set-discussed-reflection', reflection: data.reflection })
    }
  }, [])

  return (
    <div id='main-container'>
      <h3>Lobby {name} ({retrospectiveId}) - {kind}</h3>
      <div id='lobby'>
        <ParticipantsList />
        <div id='right-pannel'>
          {!loggedIn && <LoginForm retrospectiveId={retrospectiveId} handleActionReceived={handleActionReceived} />}
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
