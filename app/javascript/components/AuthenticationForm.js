import React from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import PropTypes from 'prop-types'
import { post } from 'lib/httpClient'

const AuthenticationForm = ({ onSignUpOrSignIn }) => {
  const [mode, setMode] = React.useState('signIn')
  const [username, setUsername] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [passwordConfirmation, setPasswordConfirmation] = React.useState('')

  const createAccount = () => {
    post({
      url: '/accounts',
      payload: {
        username: username,
        email: email,
        password: password,
        password_confirmation: passwordConfirmation
      }
    })
      .then(onSignUpOrSignIn)
      .catch(error => console.warn(error))
  }

  const login = () => {
    post({
      url: '/sessions',
      payload: {
        email: email,
        password: password
      }
    })
      .then(onSignUpOrSignIn)
      .catch(error => console.warn(error))
  }

  const signUpFragment = <>
    Create an account:<br />
    <form noValidate autoComplete='off'>
      <div>
        <TextField label='Username' name='username' value={username} onChange={(event) => setUsername(event.target.value)} />
        <TextField label='E-mail' name='email' value={email} onChange={(event) => setEmail(event.target.value)} style={{ marginLeft: '20px' }} />
      </div>
      <div>
        <TextField label='Password' name='password' value={password} type='password' onChange={(event) => setPassword(event.target.value)} />
        <TextField label='Confirmation' name='password_confirmation' value={passwordConfirmation} type='password' onChange={(event) => setPasswordConfirmation(event.target.value)} style={{ marginLeft: '20px' }} />
      </div>

      <Button variant='contained' color='primary' onClick={createAccount}>Create account</Button>
    </form>
    OR <a href='#' onClick={(e) => { e.preventDefault(); setMode('signIn') }}>sign in</a>
  </>

  const signInFragment = <>
    Login:<br />
    <form noValidate autoComplete='off'>
      <div>
        <TextField label='E-mail' name='email' value={email} onChange={(event) => setEmail(event.target.value)} style={{ marginLeft: '20px' }} />
        <TextField label='Password' name='password' value={password} type='password' onChange={(event) => setPassword(event.target.value)} />
      </div>
      <Button variant='contained' color='primary' onClick={login}>Login</Button>
    </form>
    OR <a href='#' onClick={(e) => { e.preventDefault(); setMode('signUp') }}>sign up</a>
  </>

  return mode === 'signUp' ? signUpFragment : signInFragment
}

AuthenticationForm.propTypes = {
  onSignUpOrSignIn: PropTypes.func.isRequired
}

AuthenticationForm.defaultProps = {
  onSignUpOrSignIn: () => { window.location.pathname = '/' }
}

export default AuthenticationForm
