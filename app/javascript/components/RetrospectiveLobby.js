import React from 'react'
import { join as joinAppearanceChannel } from 'channels/appearanceChannel'
import { join as joinOrchestratorChannel } from 'channels/orchestratorChannel'
import { uniqBy } from 'lib/helpers/array'
import RetrospectiveBottomBar from './RetrospectiveBottomBar'
import ParticipantsList from './ParticipantsList'
import LoginForm from './LoginForm'
import './RetrospectiveLobby.scss'

const subscribeToRetrospectiveChannels = ({ retrospectiveId, setChannels }) => {
  const orchestratorChannel = joinOrchestratorChannel(retrospectiveId)

  setChannels({ appearanceChannel, orchestratorChannel })
}

const AvatarPicker = () => {
  return (
    <div>
      You can choose an avatar here:
    </div>
  )
}

const RetrospectiveLobby = ({ id: retrospectiveId, name, kind, initialProfile, initialParticipants }) => {
  const [participants, setParticipants] = React.useState([...initialParticipants])

  const handleNewParticipant = React.useCallback((newParticipant) => {
    setParticipants(prevParticipants => uniqBy([...prevParticipants, newParticipant], 'uuid'))
  }, [])
  const appearanceChannel = joinAppearanceChannel({ onParticipantAppears: handleNewParticipant, retrospectiveId })
  const [channels, setChannels] = React.useState({ appearanceChannel })

  const [profile, setProfile] = React.useState(initialProfile)

  const loggedIn = () => !!profile

  React.useEffect(() => {
    // On login
    if (profile) {
      setParticipants(uniqBy([profile, ...participants], 'uuid'))
      console.log(`Added own name (${profile.surname}) before participants list (${participants.map(p => p.surname).join(', ')})`)

      const orchestratorChannel = joinOrchestratorChannel(retrospectiveId)
      setChannels({ ...channels, orchestratorChannel })
    }
  }, [profile])

  return (
    <div id='main-container'>
      <h3>Lobby {name} ({retrospectiveId}) - {kind}</h3>
      <div id='lobby'>
        <ParticipantsList participants={participants} profile={profile} />
        <div id='right-pannel'>
          {loggedIn() && <>
            <div>Logged in as {profile.surname}</div>
            <AvatarPicker />
          </>}
          {!loggedIn() && <LoginForm onLogIn={setProfile} retrospectiveId={retrospectiveId} />}
        </div>
      </div>
      <RetrospectiveBottomBar profile={profile} channels={channels} />
    </div>
  )
}

export default RetrospectiveLobby
