import React from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Modal from '@material-ui/core/Modal'
import { post } from 'lib/httpClient'
import './ReflectionsList.scss'

const ReflectionsList = ({ open, reflections, filter, onUpdateReflection, onDeleteReflection, onModalClose }) => {
  // TODO: make sure to only iterate over own reflections
  return (
    <Modal open={open} onClose={onModalClose} disableAutoFocus disablePortal>
      <form id='reflections-list-modal' noValidate autoComplete='off'>
        <div>
          <div>
            {reflections.filter((reflection) => reflection.zone.id == filter).map((reflection, index) => (
              <div key={index}>
                {reflection.content}
                <span>Edit</span> <span>Delete</span>
              </div>
            ))}
          </div>
          <Button variant='contained' color='secondary' onClick={onModalClose}>Close</Button>
        </div>
      </form>
    </Modal>
  )
}

export default ReflectionsList
