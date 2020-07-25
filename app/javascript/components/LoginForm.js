import React from 'react'
import { useDispatch } from 'react-redux'
import { post } from 'lib/httpClient'
import PropTypes from 'prop-types'
import AuthenticationForm from './AuthenticationForm'

const LoginForm = ({ retrospectiveId, invitation }) => {
  const dispatch = useDispatch()

  const handleSignUpOrSignIn = () => {
    post({
      url: `/retrospectives/${retrospectiveId}/participants`,
    })
      .then(data => {
        dispatch({ type: 'login', profile: data.profile, additionnalInfo: data.additionnal_info })
      })
      .catch(error => console.warn(error))
  }

  return (
    <AuthenticationForm onSignUpOrSignIn={handleSignUpOrSignIn} returnUrl={window.location.url} defaultEmail={invitation?.email} />
  )
}

LoginForm.propTypes = {
  invitation: PropTypes.object,
  retrospectiveId: PropTypes.string.isRequired
}

export default LoginForm
