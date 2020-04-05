import React from 'react'
import { Provider, useSelector, useDispatch } from 'react-redux'
import appStore from 'stores/app_store'
import { join as joinAppearanceChannel } from 'channels/appearanceChannel'
import { join as joinOrchestratorChannel } from 'channels/orchestratorChannel'
import { uniqBy } from 'lib/helpers/array'
import RetrospectiveArea from './RetrospectiveArea'
import ParticipantsList from './ParticipantsList'
import LoginForm from './LoginForm'
import './RetrospectiveLobby.scss'

const RetrospectiveLobby = ({ id: retrospectiveId, name, kind, zones }) => {
  const dispatch = useDispatch()
  const [timer, setTimer] = React.useState(600)

  const handleNewParticipant = React.useCallback((newParticipant) => {
    dispatch({ type: 'new-participant', newParticipant: newParticipant })
  }, [])
  React.useEffect(() => {
    const appearanceChannel = joinAppearanceChannel({ onParticipantAppears: handleNewParticipant, retrospectiveId })
    dispatch({ type: 'set-channel', channelName: 'appearanceChannel', channel: appearanceChannel })
  }, [])

  const startTimer = (duration) => {
    const endTime = (new Date()).getTime() + (duration * 1000)
    window.timerInterval = setInterval(() => {
      const remainingTime = (endTime - new Date().getTime()) / 1000
      setTimer(remainingTime > 0 ? remainingTime : 0)
      if (remainingTime === 0) {
        clearInterval(window.timerInterval)
        window.timerInterval = null
      }
    }, 500)
  }

  const handleActionReceived = React.useCallback((action, data) => {
    if (action === 'next') {
      dispatch({ type: 'change-step', step: data.next_step })
    } else if (action === 'setTimer') {
      clearInterval(window.timerInterval)
      setTimer(data.duration)
      startTimer(data.duration)
    }
  }, [])

  const profile = useSelector(state => state.profile)
  const loggedIn = useSelector(state => !!state.profile)

  React.useEffect(() => {
    // On login
    if (profile) {
      dispatch({ type: 'login', profile: profile })

      const orchestratorChannel = joinOrchestratorChannel({ retrospectiveId: retrospectiveId, onReceivedAction: handleActionReceived })
      dispatch({ type: 'set-channel', channelName: 'orchestratorChannel', channel: orchestratorChannel })
    }
  }, [loggedIn])

  return (
    <div id='main-container'>
      <h3>Lobby {name} ({retrospectiveId}) - {kind}</h3>
      <div id='lobby'>
        <ParticipantsList />
        <div id='right-pannel'>
          {!loggedIn && <LoginForm retrospectiveId={retrospectiveId} />}
          {loggedIn &&
            <RetrospectiveArea
              retrospectiveId={retrospectiveId}
              kind={kind}
              zones={zones}
              timer={timer} />
          }
        </div>
      </div>
    </div>
  )
}

const RetrospectiveLobbyWithProvider = (props) => {
  const store = appStore(props.initialState)

  return (
    <Provider store={store}>
      <RetrospectiveLobby {...props.retrospective} />
    </Provider>
  )
}

export default RetrospectiveLobbyWithProvider
