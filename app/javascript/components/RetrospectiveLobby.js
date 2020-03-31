import React from 'react'
import { join as joinAppearanceChannel } from 'channels/appearanceChannel'
import { join as joinOrchestratorChannel } from 'channels/orchestratorChannel'
import { uniqBy } from 'lib/helpers/array'
import RetrospectiveArea from './RetrospectiveArea'
import ParticipantsList from './ParticipantsList'
import LoginForm from './LoginForm'
import './RetrospectiveLobby.scss'

const RetrospectiveLobby = ({ id: retrospectiveId, name, kind, zones, initialProfile, initialParticipants, initialStep, initialOwnReflections }) => {
  const [participants, setParticipants] = React.useState([...initialParticipants])

  const handleNewParticipant = React.useCallback((newParticipant) => {
    setParticipants(prevParticipants => uniqBy([...prevParticipants, newParticipant], 'uuid'))
  }, [])
  const appearanceChannel = React.useEffect(() => {
    joinAppearanceChannel({ onParticipantAppears: handleNewParticipant, retrospectiveId })
  }, [])
  const [channels, setChannels] = React.useState({ appearanceChannel })
  const [retrospectiveStep, setRetrospectiveStep] = React.useState(initialStep)

  const handleActionReceived = React.useCallback((action, data) => {
    if (action === 'next') {
      setRetrospectiveStep(data.next_step)
    }
  }, [])

  const [profile, setProfile] = React.useState(initialProfile)

  const loggedIn = () => !!profile

  React.useEffect(() => {
    // On login
    if (profile) {
      setParticipants(uniqBy([profile, ...participants], 'uuid'))
      console.log(`Added own name (${profile.surname}) before participants list (${participants.map(p => p.surname).join(', ')})`)

      const orchestratorChannel = joinOrchestratorChannel({ retrospectiveId: retrospectiveId, onReceivedAction: handleActionReceived })
      setChannels({ ...channels, orchestratorChannel })
    }
  }, [profile])

  return (
    <div id='main-container'>
      <h3>Lobby {name} ({retrospectiveId}) - {kind}</h3>
      <div id='lobby'>
        <ParticipantsList participants={participants} profile={profile} />
        <div id='right-pannel'>
          {!loggedIn() && <LoginForm onLogIn={setProfile} retrospectiveId={retrospectiveId} />}
          {loggedIn() &&
            <RetrospectiveArea
              profile={profile}
              channels={channels}
              retrospectiveId={retrospectiveId}
              kind={kind}
              zones={zones}
              currentStep={retrospectiveStep}
              initialOwnReflections={initialOwnReflections} />
          }
        </div>
      </div>
    </div>
  )
}

export default RetrospectiveLobby
