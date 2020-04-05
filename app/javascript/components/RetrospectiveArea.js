import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { post, put, destroy } from 'lib/httpClient'
import { reject } from 'lib/helpers/array'
import GladSadMad from './retrospectives/GladSadMad'
import RetrospectiveBottomBar from './RetrospectiveBottomBar'
import ReflectionForm from './ReflectionForm'
import ReflectionsList from './ReflectionsList'

const AvatarPicker = () => {
  return (
    <div>
      You can choose an avatar here:
    </div>
  )
}

const RetrospectiveArea = ({ retrospectiveId, kind, zones, timer }) => {
  const dispatch = useDispatch()
  /* available modes
    initial
    writing-reflection
    assigning-reflection
    listing-reflections
  */
  const currentStep = useSelector(state => state.step)
  const initialOwnReflections = useSelector(state => state.ownReflections)
  const [reflections, setReflections] = React.useState([...initialOwnReflections])
  const [displayReflectionForm, setDisplayReflectionForm] = React.useState(false)
  const [displayReflectionsList, setDisplayReflectionsList] = React.useState(false)
  const [currentReflection, setCurrentReflection] = React.useState('')
  const [mode, setMode] = React.useState('initial')
  const [workingZone, setWorkingZone] = React.useState(null)

  const handleZoneClicked = (event) => {
    const zoneId = event.target.id
    console.log(`Clicked on ${zoneId}, current mode is ${mode}`)
    if (mode === 'assigning-reflection') {
      console.log('Posting the reflection')
      post({
        url: `/retrospectives/${retrospectiveId}/reflections`,
        payload: {
          content: currentReflection,
          zone_id: event.target.id
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

  const handleReflectionCreated = React.useCallback((newReflection) => {
    console.log('Received confirmation for reflection creation, resetting mode to initial')
    setReflections(prevReflections => [...prevReflections, newReflection])
    setCurrentReflection('')
    setMode('initial')
  })

  const handleChooseZoneClick = React.useCallback(() => {
    console.log('Clicked on "choose zone" CTA, changing mode to assignReflection')
    setDisplayReflectionForm(false)
    setMode('assigning-reflection')
  })

  const handleReflectionCancel = React.useCallback(() => {
    console.log('Clicked on "cancel" CTA, resetting mode to initial')
    setCurrentReflection('')
    setMode('initial')
    setDisplayReflectionForm(false)
  })

  const handleReflectionFormOpen = React.useCallback(() => {
    console.log('Opened the reflection form, resetting mode to initial')
    setMode('writing-reflection')
    setDisplayReflectionForm(true)
  })

  const handleUpdateReflection = React.useCallback(({ updatedId, updatedContent, onSuccess }) => {
    put({
      url: `/retrospectives/${retrospectiveId}/reflections/${updatedId}`,
      payload: {
        content: updatedContent
      }
    })
    .then(updatedReflection => {
      setReflections(prevReflections => [...prevReflections].map((reflection) => reflection.id == updatedId ? updatedReflection : reflection))
      onSuccess()
    })
    .catch(error => console.warn(error))
  })

  const handleDestroyReflection = React.useCallback(({ deletedId }) => {
    destroy({ url: `/retrospectives/${retrospectiveId}/reflections/${deletedId}` })
    .then(data => {
      setReflections(prevReflections => reject([...prevReflections], (reflection) => reflection.id == deletedId))
      setMode('initial')
      setDisplayReflectionsList(false)
    })
    .catch(error => console.warn(error))
  })

  const handleReflectionsListClose = React.useCallback(() => {
    setMode('initial')
    setDisplayReflectionsList(false)
  })

  // TODO: return retrospective depending on kind
  // TODO: Handle remaining states: grouping, voting, actions, done
  return (
    <>
      {currentStep === 'gathering' && <AvatarPicker />}
      {currentStep === 'thinking' && <GladSadMad mode={mode} reflections={reflections} zones={zones} onZoneClicked={handleZoneClicked} />}
      <ReflectionForm open={displayReflectionForm} value={currentReflection} onChange={setCurrentReflection} onConfirmationClick={handleChooseZoneClick} confirmationLabel={'Choose zone'} onReflectionCancel={handleReflectionCancel} />
      <ReflectionsList open={displayReflectionsList} reflections={reflections} filter={workingZone} onUpdateReflection={handleUpdateReflection} onDestroyReflection={handleDestroyReflection} onModalClose={handleReflectionsListClose} />
      <RetrospectiveBottomBar onReflectionFormOpen={handleReflectionFormOpen} timer={timer} />
    </>
  )
}

export default RetrospectiveArea
