import React from 'react'
import Button from './Button'
import Input from './Input'
import PropTypes from 'prop-types'
import { put } from 'lib/httpClient'

const PasswordResetForm = ({ passwordResetToken }) => {
  const [newPassword, setNewPassword] = React.useState('')

  const updatePassword = () => {
    put({
      url: `/password_reset/${passwordResetToken}`,
      payload: { password: newPassword }
    })
      .then(() => { window.location.pathname = '/' })
      .catch(error => console.warn(error))
  }

  return (
    <form noValidate autoComplete='off' className='max-w-xl mx-auto mt-4'>
      <div className='mb-4'>
        <Input placeholder='New password' name='password' variant='outlined' value={newPassword} onChange={(event) => setNewPassword(event.target.value)} />
      </div>

      <Button contained primary onClick={updatePassword}>Change password</Button>
    </form>
  )
}

PasswordResetForm.propTypes = {
  passwordResetToken: PropTypes.string.isRequired
}

export default PasswordResetForm
