/* eslint-disable react/display-name */
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { post } from 'lib/httpClient'
import classNames from 'classnames'
import EditIcon from 'images/edit-icon.svg'
import PlusIcon from 'images/plus-icon.svg'
import './StickyNote.scss'

const BlankStickyNote = ({ ownerProfile, onReflectionReady, onReflectionPending, selectedZone }) => {
  const dispatch = useDispatch()

  const [editing, setEditing] = React.useState(false)
  const [ready, setReady] = React.useState(false)
  const [editTextArea, setEditTextArea] = React.useState(null)

  const retrospectiveId = useSelector(state => state.retrospective.id)

  const onEditTextAreaRefChange = React.useCallback(element => {
    setEditTextArea(element)
    if (element !== null) {
      element.style.height = '5px'
      element.style.height = (element.scrollHeight) + 'px'
      element.focus()
      element.setSelectionRange(element.value.length, element.value.length)
    }
  }, [])

  const handleChange = () => {
    editTextArea.style.height = '5px'
    editTextArea.style.height = (editTextArea.scrollHeight) + 'px'
  }

  const handleFocus = () => {
    setEditing(true)
    setReady(false)
    onReflectionPending()
  }

  const handleBlur = (event) => {
    if (event.currentTarget.value.length > 0) {
      setReady(true)
      onReflectionReady()
    } else {
      setEditing(false)
      setReady(false)
    }
  }

  React.useEffect(() => {
    if (selectedZone && ready && editTextArea?.value?.length > 0) {
      post({
        url: `/retrospectives/${retrospectiveId}/reflections`,
        payload: {
          content: editTextArea.value,
          zone_id: selectedZone
        }
      })
        .then(data => handleReflectionCreated(data))
        .catch(error => console.warn(error))
    }
  }, [editTextArea, handleReflectionCreated, ready, retrospectiveId, selectedZone])

  const handleReflectionCreated = React.useCallback((newReflection) => {
    dispatch({ type: 'add-reflection', reflection: newReflection })
    setEditing(false)
    setReady(false)
    onReflectionPending()
  }, [dispatch, onReflectionPending])

  const handleStartEditing = () => {
    setEditing(true)
  }

  const colorStyle = {
    borderColor: ownerProfile.color,
    backgroundColor: ownerProfile.color
  }

  return (
    <div className='flex flex-col'>
      {ready && <div>Now click on a zone above</div>}
      <div
        className={classNames('reflection flex flex-col p-2 rounded-md absolute w-64 min-h-8 right-2 bottom-0 overflow-y-hidden', { '-mb-4': !editing, 'cursor-pointer': !editing })}
        style={colorStyle}
        onClick={() => !editing && handleStartEditing()}>
        <div className='reflection-content-container'>
          {!editing && <div className='font-bold mb-2'>Click here to add a reflection</div>}
          {editing && (
            <>
              <div className='font-bold mb-2'>{ownerProfile.surname}</div>
              <textarea name='content' className='bg-transparent border-none outline-none overflow-hidden resize-none' ref={onEditTextAreaRefChange} onFocus={handleFocus} onChange={handleChange} onBlur={handleBlur} />
            </>
          )}
        </div>
        <div className='absolute right-0 mr-2'>
          {!editing && <img src={PlusIcon} className='create-icon inline cursor-pointer mr-2 w-2' onClick={handleFocus} />}
          {editing && ready && <img src={EditIcon} className='edit-icon inline cursor-pointer mr-2' onClick={handleFocus} />}
        </div>
      </div>
    </div>
  )
}

BlankStickyNote.propTypes = {
  ownerProfile: PropTypes.shape({
    color: PropTypes.string.isRequired,
    surname: PropTypes.string.isRequired
  }).isRequired,
  onReflectionReady: PropTypes.func.isRequired,
  onReflectionPending: PropTypes.func.isRequired,
  selectedZone: PropTypes.string
}

export default BlankStickyNote
