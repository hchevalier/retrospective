import React from 'react'
import PropTypes from 'prop-types'
import { post } from 'lib/httpClient'

const AuthenticationForm = ({ onSignUpOrSignIn }) => {
  const [mode, setMode] = React.useState('signIn')
  const [username, setUsername] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [passwordConfirmation, setPasswordConfirmation] = React.useState('')

  const createAccount = (e) => {
    e.preventDefault()
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

  const login = (e) => {
    e.preventDefault()
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

  const signUpFragment = <div className='w-full max-w-xl mx-auto mt-4'>
    <form noValidate autoComplete='off' className='px-8 pt-6 pb-8 mb-4' onSubmit={createAccount}>
      <p className='mb-3'>Create an account</p>
      <div className='flex mb-4'>
        <Input placeholder='Username' name='username' value={username} onChange={(event) => setUsername(event.target.value)} />
        <Input placeholder='E-mail' name='email' value={email} onChange={(event) => setEmail(event.target.value)} style={{ marginLeft: '20px' }} />
      </div>
      <div className='flex mb-4'>
        <Input placeholder='Password' name='password' value={password} type='password' onChange={(event) => setPassword(event.target.value)} />
        <Input placeholder='Confirmation' name='password_confirmation' value={passwordConfirmation} type='password' onChange={(event) => setPasswordConfirmation(event.target.value)} style={{ marginLeft: '20px' }} />
      </div>

      <div className='flex items-center justify-between'>
        <button className='bg-blue-500 hover:bg-blue-700 text-white font-medium py-1 px-2 rounded focus:outline-none focus:shadow-outline' type='submit'>
          Create account
        </button>
        <button className="inline-block align-baseline bg-transparent font-bold text-sm text-blue-500 hover:text-blue-800" onClick={() => setMode('signIn')} type='button'>
          Already have an account?
        </button>
      </div>
    </form>
  </div>

  const signInFragment = <div className='w-full max-w-xl mx-auto mt-4'>
    <form noValidate autoComplete='off' className='px-8 pt-6 pb-8 mb-4' onSubmit={login}>
      <p className='mb-3'>Login</p>

      <div className='mb-4'>
        <Input placeholder='E-mail' name='email' value={email} onChange={(event) => setEmail(event.target.value)} />
      </div>
      <div className='mb-4'>
        <Input placeholder='Password' name='password' value={password} type='password' onChange={(event) => setPassword(event.target.value)} />
      </div>
      <div className='flex items-center justify-between'>
        <button className='bg-blue-500 hover:bg-blue-700 text-white font-medium py-1 px-2 rounded focus:outline-none focus:shadow-outline' type='submit'>
          Login
        </button>
        <button className="inline-block align-baseline bg-transparent font-bold text-sm text-blue-500 hover:text-blue-800" onClick={() => setMode('signUp')} type='button'>
          Don&apos;t have an account yet?
        </button>
      </div>
    </form>
  </div>

  return mode === 'signUp' ? signUpFragment : signInFragment
}

AuthenticationForm.propTypes = {
  onSignUpOrSignIn: PropTypes.func.isRequired
}

AuthenticationForm.defaultProps = {
  onSignUpOrSignIn: () => { window.location.pathname = '/' }
}

const Input = (props) => (
  <input className="border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" {...props} />
)

export default AuthenticationForm
