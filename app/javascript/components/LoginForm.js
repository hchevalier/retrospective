import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { post } from 'lib/httpClient'
import consumer from 'channels/consumer'
import { join as joinOrchestratorChannel } from 'channels/orchestratorChannel'

const LoginForm = ({ retrospectiveId }) => {
  const dispatch = useDispatch()

  const [surname, setSurname] = React.useState('')
  const [email, setEmail] = React.useState('')
  const channel = useSelector(state => state.orchestrator)

  const login = () => {
    post({
      url: `/retrospectives/${retrospectiveId}/participants`,
      payload: {
        surname: surname,
        email: email
      }
    })
    .then(data => {
      dispatch({ type: 'login', profile: data.profile, additionnalInfo: data.additionnal_info })
    })
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

export default LoginForm
