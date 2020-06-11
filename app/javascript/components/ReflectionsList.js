import React from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import Button from './Button'
import Modal from './Modal'
import ReflectionForm from './ReflectionForm'
import Icon from './Icon'

const ReflectionsList = ({ open, filter, retrospectiveKind, withIcon, onUpdateReflection, onDestroyReflection, onModalClose }) => {
  const revealer = useSelector(state => state.profile.revealer)
  const currentStep = useSelector(state => state.orchestrator.step)
  const reflections = useSelector(state => state.reflections.ownReflections, shallowEqual)
  const channel = useSelector(state => state.orchestrator.subscription)

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

  const shouldDisplayReflection = React.useCallback((reflection) => currentStep !== 'thinking' || reflection.zone.id == filter, [currentStep, filter])
  const displayableReflections = reflections.filter(shouldDisplayReflection)
  const unrevealed = displayableReflections.filter((reflection) => !reflection.revealed).length

  React.useEffect(() => {
    if (revealer && unrevealed === 0) {
      onModalClose()
    }
  }, [unrevealed])

  return (
    <>
      <Modal open={open} onClose={onModalClose} disableAutoFocus disablePortal>
        <form id='reflections-list-modal' noValidate autoComplete='off' className="overflow-y-auto">
          <div>
            <div>
              {displayableReflections.filter(shouldDisplayReflection).map((reflection, index) => (
                <div key={index}>
                  {withIcon && <Icon retrospectiveKind={retrospectiveKind} zone={reflection.zone.name} />}
                  <span>{reflection.content}</span>&nbsp;
                  {currentStep == 'thinking' && (
                    <>
                      <Button primary data-id={reflection.id} onClick={handleEditClick}>Edit</Button>&nbsp;
                      <Button secondary data-id={reflection.id} onClick={handleDeleteClick}>Delete</Button>
                    </>
                  )}
                  {shouldDisplayReveal() &&
                    <Button
                      secondary
                      disabled={reflection.revealed}
                      data-id={reflection.id}
                      onClick={handleRevealClick}>
                      {reflection.revealed ? 'Revealed' : 'Reveal'}
                    </Button>
                  }
                </div>
              ))}
            </div>
            <Button contained secondary onClick={onModalClose}>Close</Button>
          </div>
        </form>
      </Modal>
      <ReflectionForm open={displayEditForm} value={reworkedReflectionContent} onChange={setReworkedReflectionContent} onConfirmationClick={handleReflectionUpdate} confirmationLabel={'Update'} onReflectionCancel={handleEditCancel} />
    </>
  )
}

export default ReflectionsList
