import React from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import FormControl from '@material-ui/core/FormControl'
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
    <form noValidate autoComplete='off'>
      <FormControl style={{ marginLeft: '20px', minWidth: '200px' }}>
        <TextField label='New password' name='password' variant='outlined' value={newPassword} onChange={(event) => setNewPassword(event.target.value)} />
      </FormControl>

      <Button variant='contained' color='primary' onClick={updatePassword}>Change password</Button>
    </form>
  )
}

PasswordResetForm.propTypes = {
  passwordResetToken: PropTypes.string.isRequired
}

export default PasswordResetForm
