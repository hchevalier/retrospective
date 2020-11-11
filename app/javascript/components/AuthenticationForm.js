import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import { post } from 'lib/httpClient'
import Card from './Card'
import Input from './Input'
import Button from './Button'
import GoogleButton from 'images/btn_google_signin_light_normal_web@2x.png'

const AuthenticationForm = ({ defaultEmail, onLogIn, returnUrl }) => {
  const [mode, setMode] = React.useState('signIn')
  const [username, setUsername] = React.useState('')
  const [email, setEmail] = React.useState(defaultEmail || '')
  const [password, setPassword] = React.useState('')
  const [passwordResetToastDisplayed, setPasswordResetToastDisplayed] = React.useState(false)
  const formRef = useRef()

  const handleSubmit = (e) => {
    e.preventDefault()

    post({
      url: mode === 'signIn' ? '/sessions' : '/accounts',
      payload: { username, email, password }
    })
      .then(() => onLogIn())
      .catch(error => { alert(error)})
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
        .catch(error => alert(error))
    }
  }

  const csrfToken = document.querySelector('[name=csrf-token]').content

  return (
    <div className='max-w-xl min-w-1/2 mx-auto mt-4'>
      <Card title={mode === 'signUp' ? 'Create an account' : 'Log in'} center>
        <form noValidate autoComplete='off' onSubmit={handleSubmit} className='w-full'>
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
      </Card>

      {window.constants.googleAuthenticationEnabled === 'true' && (
        <div className='text-center mt-4 flex justify-center'>
          <form ref={formRef} action={`/auth/google_oauth2?return_to=${returnUrl ? returnUrl : '/dashboard'}`} method="post">
            <input type="hidden" name="authenticity_token" value={csrfToken} />
            <span>or</span>
            <img id='google-authentication' className='cursor-pointer' src={GoogleButton} width='200' onClick={() => formRef.current?.submit()} />
          </form>
        </div>
      )}
    </div>
  )
}

AuthenticationForm.propTypes = {
  defaultEmail: PropTypes.string,
  onLogIn: PropTypes.func.isRequired,
  returnUrl: PropTypes.string
}

export default AuthenticationForm
