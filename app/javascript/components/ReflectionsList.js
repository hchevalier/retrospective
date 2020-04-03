import React from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Modal from '@material-ui/core/Modal'
import { post } from 'lib/httpClient'
import './ReflectionsList.scss'

const ReflectionsList = ({ open, reflections, filter, onUpdateReflection, onDestroyReflection, onModalClose }) => {
  const handleEditClick = () => {
    const updatedId = event.target.dataset.id
    const updatedContent = 'Updated content'
    onUpdateReflection({ updatedId, updatedContent})
  }

  const handleDeleteClick = () => {
    const deletedId = event.target.dataset.id
    onDestroyReflection({ deletedId })
  }

  return (
    <Modal open={open} onClose={onModalClose} disableAutoFocus disablePortal>
      <form id='reflections-list-modal' noValidate autoComplete='off'>
        <div>
          <div>
            {reflections.filter((reflection) => reflection.zone.id == filter).map((reflection, index) => (
              <div key={index}>
                <span>{reflection.content}</span>&nbsp;
                <span data-id={reflection.id} onClick={handleEditClick}>Edit</span>&nbsp;
                <span data-id={reflection.id} onClick={handleDeleteClick}>Delete</span>
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
