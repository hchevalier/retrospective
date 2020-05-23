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
  const [passwordResetToastDisplayed, setPasswordResetToastDisplayed] = React.useState(false)


  const handleSubmit = () => {
    post({
      url: mode === 'signIn' ? '/sessions' : '/accounts',
      payload: { username, email, password }
    })
      .then(onSignUpOrSignIn)
      .catch(error => console.warn(error))
  }

  const onPasswordReset = () => {
    setPasswordResetToastDisplayed(true)
    setTimeout(() => setPasswordResetToastDisplayed(false), 30000)
  }

  const toggleMode = (e) => {
    e.preventDefault()
    setMode(mode === 'signIn' ? 'signUp' : 'signIn')
  }

  const resetPassword = (e) => {
    e.preventDefault()
    if (email.length > 0 && !passwordResetToastDisplayed) {
      post({
        url: '/password_reset',
        payload: { email }
      })
        .then(onPasswordReset)
        .catch(error => console.warn(error))
    }
  }

  return (
    <>
      <div>{mode === 'signUp' ? 'Create an account' : 'Log in'}:</div>
      <form noValidate autoComplete='off'>
        <div>
          <TextField label='E-mail' name='email' value={email} onChange={(event) => setEmail(event.target.value)} />
          <TextField label='Password' name='password' value={password} type='password' onChange={(event) => setPassword(event.target.value)} style={{ marginLeft: '20px' }} />
          {mode === 'signUp' && <TextField label='Username' name='username' value={username} onChange={(event) => setUsername(event.target.value)} style={{ marginLeft: '20px' }} />}
          {mode === 'signIn' && !passwordResetToastDisplayed && <div><a href='#' onClick={resetPassword}>I forgot my password</a></div>}
          {mode === 'signIn' && passwordResetToastDisplayed && <div>An email has been sent</div>}
        </div>

        <Button variant='contained' color='primary' onClick={handleSubmit}>{mode === 'signUp' ? 'Create account' : 'Login'}</Button>
      </form>
      OR <a href='#' onClick={toggleMode}>sign {mode === 'signUp' ? 'in' : 'up'}</a>
    </>
  )
}

AuthenticationForm.propTypes = {
  onSignUpOrSignIn: PropTypes.func.isRequired
}

AuthenticationForm.defaultProps = {
  onSignUpOrSignIn: () => { window.location.pathname = '/' }
}

export default AuthenticationForm
