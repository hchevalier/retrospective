import React from 'react'
import Cookies from 'js-cookie'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { post } from 'lib/httpClient'
import { join as joinAppearanceChannel } from "channels/appearanceChannel"
import { join as joinOrchestratorChannel } from "channels/orchestratorChannel"
import RetrospectiveBottomBar from './RetrospectiveBottomBar'

const subscribeToRetrospectiveChannels = ({ retrospectiveId, setChannels }) => {
  const appearanceChannel = joinAppearanceChannel(retrospectiveId)
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

const LoginForm = ({ retrospectiveId, onLogIn }) => {
  const [surname, setSurname] = React.useState('')
  const [email, setEmail] = React.useState('')

  const login = () => {
    post({
      url: '/participants',
      payload: {
        retrospective_id: retrospectiveId,
        surname: surname,
        email: email
      }
    })
    .then(profile => onLogIn(profile))
    .catch(error => console.warn(error))
  }

  return (
    <form noValidate autoComplete='off'>
      <div>
        <div>
          You:<br />
          <TextField label='Surname' name='surname' value={surname} onChange={(event) => setSurname(event.target.value)} />
          <TextField label='E-mail' name='email' value={email} onChange={(event) => setEmail(event.target.value)} style={{ marginLeft: '20px' }} />
        </div>
        <Button variant='contained' color='primary' onClick={login}>Join</Button>
      </div>
    </form>
  )
}

const RetrospectiveLobby = ({ id, name, kind, initialProfile }) => {
  const [channels, setChannels] = React.useState({})
  const [loggedIn, setLoggedIn] = React.useState(Cookies.get('user_id') !== undefined)
  const [profile, setProfile] = React.useState(initialProfile)

  React.useEffect(() => loggedIn && subscribeToRetrospectiveChannels({ retrospectiveId: id, setChannels }), [])

  const finalizeLogin = (profile) => {
    setLoggedIn(true)
    setProfile(profile)
    subscribeToRetrospectiveChannels({ retrospectiveId: id, setChannels })
  }

  return (
    <div>
      <h3>Lobby {name} ({id}) - {kind}</h3>
      {loggedIn && <>
        <div>Logged in as {profile.surname}</div>
        <AvatarPicker />
      </>}
      {!loggedIn && <LoginForm onLogIn={finalizeLogin} retrospectiveId={id} />}
      <RetrospectiveBottomBar organizer={loggedIn && profile.organizer} channels={channels} />
    </div>
  )
}

export default RetrospectiveLobby
