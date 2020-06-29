import React from 'react'
import PropTypes from 'prop-types'
import { post } from 'lib/httpClient'
import Input from './Input'
import Button from './Button'

const AuthenticationForm = ({ onSignUpOrSignIn }) => {
  const [mode, setMode] = React.useState('signIn')
  const [username, setUsername] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [passwordResetToastDisplayed, setPasswordResetToastDisplayed] = React.useState(false)


  const handleSubmit = (e) => {
    e.preventDefault()

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
    <div className='max-w-xl min-w-1/2 mx-auto mt-4'>
      <form noValidate autoComplete='off' onSubmit={handleSubmit}>
        <p className='mb-3'>{mode === 'signUp' ? 'Create an account' : 'Log in'}</p>
        <div>
          <div className='mb-4'>
            <Input placeholder='E-mail' name='email' value={email} onChange={(event) => setEmail(event.target.value)} />
          </div>
          <div className='mb-4'>
            <Input placeholder='Password' name='password' value={password} type='password' onChange={(event) => setPassword(event.target.value)} />
          </div>
          {mode === 'signUp' && (
            <div className='mb-4'>
              <Input placeholder='Username' name='username' value={username} onChange={(event) => setUsername(event.target.value)} />
            </div>
          )}
          {mode === 'signIn' && !passwordResetToastDisplayed && <div className='mb-4'><Button primary onClick={resetPassword}>I forgot my password</Button></div>}
          {mode === 'signIn' && passwordResetToastDisplayed && <div className='mb-4'>An email has been sent</div>}
        </div>

        <div className='flex items-center justify-between'>
          <Button contained primary type='submit'>{mode === 'signUp' ? 'Create account' : 'Login'}</Button>
          <Button primary onClick={toggleMode}>
            {mode === 'signIn' ? "Don't have an account yet?" : 'Already have an account?'}
          </Button>
        </div>
      </form>
    </div>
  )
}

AuthenticationForm.propTypes = {
  onSignUpOrSignIn: PropTypes.func.isRequired
}

AuthenticationForm.defaultProps = {
  onSignUpOrSignIn: () => { window.location.pathname = '/' }
}

export default AuthenticationForm
