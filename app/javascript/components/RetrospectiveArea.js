import React, { useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { post, put, destroy } from 'lib/httpClient'
import ColorPicker from './ColorPicker'
import GladSadMad from './retrospectives/GladSadMad'
import Starfish from './retrospectives/Starfish'
import RetrospectiveBottomBar from './RetrospectiveBottomBar'
import ReflectionForm from './ReflectionForm'
import ReflectionsList from './ReflectionsList'
import Sailboat from './retrospectives/Sailboat'
import StepGrouping from './StepGrouping'
import StepVoting from './StepVoting'
import StepActions from './StepActions'
import StepDone from './StepDone'

const RetrospectiveArea = ({ retrospectiveId, kind }) => {
  const dispatch = useDispatch()
  /* available modes
    initial
    writing-reflection
    assigning-reflection
    listing-reflections
  */
  const revealer = useSelector(state => state.profile.revealer)
  const currentStep = useSelector(state => state.orchestrator.step)
  const channel = useSelector(state => state.orchestrator.subscription)

  const [displayReflectionForm, setDisplayReflectionForm] = useState(false)
  const [displayReflectionsList, setDisplayReflectionsList] = useState(false)
  const [currentReflection, setCurrentReflection] = useState('')
  const [mode, setMode] = useState('initial')
  const [workingZone, setWorkingZone] = useState(null)

  const handleZoneClicked = (event) => {
    event.stopPropagation()

    const zoneId = event.target.dataset.id
    if (mode === 'assigning-reflection') {
      post({
        url: `/retrospectives/${retrospectiveId}/reflections`,
        payload: {
          content: currentReflection,
          zone_id: zoneId
        }
      })
      .then(data => handleReflectionCreated(data))
      .catch(error => console.warn(error))
    } else if (mode === 'initial') {
      setMode('listing-reflections')
      setWorkingZone(zoneId)
      setDisplayReflectionsList(true)
    }
  }

  const handleReflectionCreated = useCallback((newReflection) => {
    dispatch({ type: 'add-reflection', reflection: newReflection })
    setCurrentReflection('')
    setMode('initial')
  }, [dispatch])

  const handleChooseZoneClick = useCallback(() => {
    setDisplayReflectionForm(false)
    setMode('assigning-reflection')
  }, [])

  const handleReflectionCancel = useCallback(() => {
    setCurrentReflection('')
    setMode('initial')
    setDisplayReflectionForm(false)
  }, [])

  const handleReflectionFormOpen = useCallback(() => {
    setMode('writing-reflection')
    setDisplayReflectionForm(true)
  }, [])

  const handleUpdateReflection = useCallback(({ updatedId, updatedContent, onSuccess }) => {
    put({
      url: `/retrospectives/${retrospectiveId}/reflections/${updatedId}`,
      payload: {
        content: updatedContent
      }
    })
    .then(updatedReflection => {
      dispatch({ type: 'change-reflection', reflection: updatedReflection })
      onSuccess()
    })
    .catch(error => console.warn(error))
  }, [dispatch, retrospectiveId])

  const handleDestroyReflection = useCallback(({ deletedId }) => {
    destroy({ url: `/retrospectives/${retrospectiveId}/reflections/${deletedId}` })
    .then(() => {
      dispatch({ type: 'delete-reflection', reflectionId: deletedId })
      setMode('initial')
      setDisplayReflectionsList(false)
    })
    .catch(error => console.warn(error))
  }, [dispatch, retrospectiveId])

  const handleReflectionsListClose = useCallback(() => {
    if (revealer && channel) {
      channel.dropRevealerToken()
    }
    setMode('initial')
    setDisplayReflectionsList(false)
  }, [channel, revealer])

  const renderRetrospective = () => {
    if (kind === 'glad_sad_mad') {
      return <GladSadMad mode={mode} onZoneClicked={handleZoneClicked} />
    } else if (kind === 'sailboat') {
      return <Sailboat mode={mode} onZoneClicked={handleZoneClicked} />
    } else if (kind === 'starfish') {
      return <Starfish mode={mode} onZoneClicked={handleZoneClicked} />
    }

    return <div>Unknown retrospective {kind}</div>
  }

  return (
    <div className='flex flex-col'>
      {currentStep === 'gathering' && <ColorPicker retrospectiveId={retrospectiveId} />}
      {currentStep === 'thinking' && renderRetrospective()}
      {currentStep === 'grouping' && <StepGrouping />}
      {currentStep === 'voting' && <StepVoting />}
      {currentStep === 'actions' && <StepActions />}
      {currentStep === 'done' && <StepDone />}
      <ReflectionForm
        open={displayReflectionForm}
        value={currentReflection}
        onChange={setCurrentReflection}
        onConfirmationClick={handleChooseZoneClick}
        confirmationLabel={'Choose zone'}
        onReflectionCancel={handleReflectionCancel} />
      <ReflectionsList
        open={displayReflectionsList || revealer}
        retrospectiveKind={kind}
        withIcon={revealer}
        filter={workingZone}
        onUpdateReflection={handleUpdateReflection}
        onDestroyReflection={handleDestroyReflection}
        onModalClose={handleReflectionsListClose} />
      <RetrospectiveBottomBar onReflectionFormOpen={handleReflectionFormOpen} />
    </div>
  )
}

export default RetrospectiveArea
