import React from 'react'
import { useSelector } from 'react-redux'
import Modal from './Modal'
import PropTypes from 'prop-types'

const ReflectionForm = ({ open, value, confirmationLabel, onChange, onConfirmationClick, onReflectionCancel }) => {
  const profile = useSelector(state => state.profile)

  return (
    <Modal open={open} onClose={onReflectionCancel} disableAutoFocus disablePortal>
      <form id='reflection-form-modal' noValidate autoComplete='off'>
        <div>
          <div>
            <textarea className='p-1 rounded' placeholder='Reflection' name='content' value={value} multiline rows={8} style={{ backgroundColor: profile.color }} onChange={(event) => onChange(event.target.value)} />
          </div>
          <div className="mt-4">
            <button className='bg-blue-500 hover:bg-blue-700 text-white font-medium py-1 px-2 rounded focus:outline-none focus:shadow-outline' type='button' onClick={onConfirmationClick}>
              {confirmationLabel}
            </button>

            <button className='bg-red-500 hover:bg-red-700 text-white font-medium py-1 px-2 ml-2 rounded focus:outline-none focus:shadow-outline' type='button' onClick={onReflectionCancel}>
              Cancel
            </button>
          </div>
        </div>
      </form>
    </Modal>
  )
}

ReflectionForm.propTypes = {
  open: PropTypes.bool,
  value: PropTypes.string,
  confirmationLabel: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onConfirmationClick: PropTypes.func.isRequired,
  onReflectionCancel: PropTypes.func.isRequired,
}

export default ReflectionForm
