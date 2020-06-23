import React from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import classNames from 'classnames'
import { groupBy } from 'lib/helpers/array'
import Button from './Button'
import ReflectionForm from './ReflectionForm'
import Icon from './Icon'
import ArrowIcon from 'images/arrow-icon.svg'

const ReflectionsList = ({ open, retrospectiveKind, onUpdateReflection, onDestroyReflection, onToggle, onDone }) => {
  const revealer = useSelector(state => state.profile.revealer)
  const currentStep = useSelector(state => state.orchestrator.step)
  const reflections = useSelector(state => state.reflections.ownReflections, shallowEqual)
  const zones = useSelector(state => state.retrospective.zones, shallowEqual)
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

  const unrevealed = reflections.filter((reflection) => !reflection.revealed).length

  React.useEffect(() => {
    if (revealer && unrevealed === 0) {
      onDone()
    }
  }, [unrevealed])

  const reflectionsByZone = groupBy(reflections, 'zone.id')

  return (
    <>
      <div id='reflections-pannel' className='bg-gray-200 mr-4 relative -left-4 -mt-6 p-4 shadow-right flex'>
        {!revealer && (
          <div className='justify-start items-start'>
            <img className={classNames('cursor-pointer duration-200 ease-in-out transition-transform transform rotate-90', { '-rotate-90': open })} src={ArrowIcon} width="24" onClick={onToggle} />
          </div>
        )}
        <div className={classNames('transition-width duration-500 ease-in-out w-0 h-full overflow-x-hidden', { 'w-64': open })}>
          {zones.map((zone) => {
            const reflectionsInZone = reflectionsByZone[zone.id] || []
            return (
              <div key={zone.id} className='p-2 border-t'>
                <div>
                  <Icon retrospectiveKind={retrospectiveKind} zone={zone.name} /> {zone.name}
                </div>
                {reflectionsInZone.filter((reflection) => !reflection.revealed).map((reflection) => (
                  <div key={reflection.id}>
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
            )
          })}
        </div>
      </div>
      <ReflectionForm open={displayEditForm} value={reworkedReflectionContent} onChange={setReworkedReflectionContent} onConfirmationClick={handleReflectionUpdate} confirmationLabel={'Update'} onReflectionCancel={handleEditCancel} />
    </>
  )
}

export default ReflectionsList
