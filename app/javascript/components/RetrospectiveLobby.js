import React from 'react'
import Cookies from 'js-cookie'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { post } from 'lib/httpClient'
import consumer from "channels/consumer"

const subscribeToAppearances = ({ retrospectiveId }) => {
  const channel = consumer.subscriptions.create({ channel: 'AppearanceChannel', retrospective_id: retrospectiveId }, {
    connected() {
      console.log('You are connected to the room!')
      channel.send({ body: 'Hello' })
    },
    disconnected() {
      console.log('You were disconnected from the room!')
    },
    received(data) {
      if (data.new_participant) {
        console.log('New participant', data.new_participant)
      } else if (data.body) {
        console.log(data.body)
      }
    },
  })
}

const checkLoggedIn = ({ retrospectiveId }) => {
  if (Cookies.get('user_id')) {
    subscribeToAppearances({ retrospectiveId })
    return true
  }

  return false
}

const AvatarPicker = () => {
  return (
    <div>
      You can choose an avatar here:
    </div>
  )
}

const finalizeLogin = ({ retrospectiveId, onLogIn }) => {
  onLogIn(true)
  subscribeToAppearances({ retrospectiveId })
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
    .then(_ => finalizeLogin({ onLogIn, retrospectiveId }))
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

const RetrospectiveLobby = ({ id, name, kind }) => {
  const [loggedIn, setloggedIn] = React.useState(checkLoggedIn({ retrospectiveId: id }))

  return (
    <div>
      <h3>Lobby {name} ({id})</h3>
      {loggedIn && <AvatarPicker />}
      {!loggedIn && <LoginForm onLogIn={setloggedIn} retrospectiveId={id} />}
    </div>
  )
}

export default RetrospectiveLobby
