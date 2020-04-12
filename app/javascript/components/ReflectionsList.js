import React from 'react'
import { useSelector } from 'react-redux'
import Button from '@material-ui/core/Button'
import Modal from '@material-ui/core/Modal'
import ReflectionForm from './ReflectionForm'
import './ReflectionsList.scss'

const ReflectionsList = ({ open, filter, onUpdateReflection, onDestroyReflection, onModalClose }) => {
  const revealer = useSelector(state => state.profile.revealer)
  const currentStep = useSelector(state => state.step)
  const reflections = useSelector(state => state.ownReflections)
  const channel = useSelector(state => state.orchestrator)

  const [displayEditForm, setDisplayEditForm] = React.useState(false)
  const [reworkedReflectionId, setReworkedReflectionId] = React.useState(null)
  const [reworkedReflectionContent, setReworkedReflectionContent] = React.useState('')

  const handleEditClick = (event) => {
    setDisplayEditForm(true)
    const reflectionId = event.currentTarget.dataset.id
    setReworkedReflectionId(reflectionId)
    setReworkedReflectionContent(reflections.find((reflection) => reflection.id === reflectionId).content)
  }

  const handleReflectionUpdate = () => {
    const updatedId = reworkedReflectionId
    const updatedContent = reworkedReflectionContent
    onUpdateReflection({ updatedId, updatedContent, onSuccess: handleEditCancel })
  }

  const handleEditCancel = () => {
    setDisplayEditForm(false)
    setReworkedReflectionId(null)
    setReworkedReflectionContent(null)
  }

  const handleDeleteClick = (event) => {
    const deletedId = event.currentTarget.dataset.id
    onDestroyReflection({ deletedId })
  }

  const handleRevealClick = (event) => {
    const reflectionUuid = event.currentTarget.dataset.id
    channel.reveal(reflectionUuid)
  }

  const shouldDisplayReveal = React.useCallback(() => revealer && currentStep === 'grouping', [revealer, currentStep])

  const shouldDisplayReflection = React.useCallback((reflection) => {
    return (currentStep !== 'thinking' || reflection.zone.id == filter) && !reflection.revealed
  }, [currentStep, filter])

  return (
    <>
      <Modal open={open} onClose={onModalClose} disableAutoFocus disablePortal>
        <form id='reflections-list-modal' noValidate autoComplete='off'>
          <div>
            <div>
              {reflections.filter(shouldDisplayReflection).map((reflection, index) => (
                <div key={index}>
                  <span>{reflection.content}</span>&nbsp;
                  {currentStep == 'thinking' && (
                    <>
                      <Button color='primary' size='small' data-id={reflection.id} onClick={handleEditClick}>Edit</Button>&nbsp;
                      <Button color='secondary' size='small' data-id={reflection.id} onClick={handleDeleteClick}>Delete</Button>
                    </>
                  )}
                  {shouldDisplayReveal() && <Button color='secondary' size='small' data-id={reflection.id} onClick={handleRevealClick}>Reveal</Button>}
                </div>
              ))}
            </div>
            <Button variant='contained' color='secondary' onClick={onModalClose}>Close</Button>
          </div>
        </form>
      </Modal>
      <ReflectionForm open={displayEditForm} value={reworkedReflectionContent} onChange={setReworkedReflectionContent} onConfirmationClick={handleReflectionUpdate} confirmationLabel={'Update'} onReflectionCancel={handleEditCancel} />
    </>
  )
}

export default ReflectionsList
