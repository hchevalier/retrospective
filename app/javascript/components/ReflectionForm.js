import React from 'react'
import { useSelector } from 'react-redux'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Modal from '@material-ui/core/Modal'
import './ReflectionForm.scss'

const ReflectionForm = ({ open, value, confirmationLabel, onChange, onConfirmationClick, onReflectionCancel }) => {
  const profile = useSelector(state => state.profile)

  return (
    <Modal open={open} onClose={onReflectionCancel} disableAutoFocus disablePortal>
      <form id='reflection-form-modal' noValidate autoComplete='off'>
        <div>
          <div>
            <TextField label='Reflection' name='content' variant='outlined' value={value} multiline rows={8} style={{ backgroundColor: profile.color }} onChange={(event) => onChange(event.target.value)} />
          </div>
          <Button variant='contained' color='primary' onClick={onConfirmationClick}>{confirmationLabel}</Button>
          <Button variant='contained' color='secondary' onClick={onReflectionCancel}>Cancel</Button>
        </div>
      </form>
    </Modal>
  )
}

export default ReflectionForm
