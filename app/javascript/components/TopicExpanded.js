import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useSelector, shallowEqual } from 'react-redux'
import { put } from 'lib/httpClient'
import StickyNote from './StickyNote'
import './Topic.scss'
import EditIcon from 'images/edit-icon.svg'

const TopicExpanded = ({ editable, forceTopicEditing, topic, onCollapseTopic, onTopicChange }) => {
  const { id: retrospectiveId } = useSelector(state => state.retrospective)
  const reflections = useSelector(state => state.reflections.visibleReflections, shallowEqual)
  const visibleReactions = useSelector(state => state.reactions.visibleReactions, shallowEqual)

  const [editing, setEditing] = useState((forceTopicEditing || false) && editable)
  const [, setEditTextArea] = useState(null)
  const [draggingReflection, setDraggingReflection] = useState(false)

  const reflectionsInTopic = reflections.filter((reflection) => reflection.topic?.id === topic.id)
  const reflectionIds = reflectionsInTopic.map((reflection) => reflection.id)
  const reactions = visibleReactions.filter((reaction) => reflectionIds.includes(reaction.targetId.split(/-(.+)?/, 2)[1]))

  useEffect(() => {
    if (reflectionsInTopic.length === 1) onCollapseTopic()
  }, [reflectionsInTopic.length, onCollapseTopic])

  const handleEditLabel = (event) => {
    event.stopPropagation()
    if (!editable) return
    setEditing(true)
  }

  const handleBackdropClick = () => {
    if (editing) return

    onCollapseTopic()
  }

  const onEditTextAreaRefChange = React.useCallback(element => {
    setEditTextArea(element)
    if (element !== null) {
      element.style.height = '5px'
      element.style.height = (element.scrollHeight) + 'px'
      element.focus()
      element.setSelectionRange(element.value.length, element.value.length)
    }
  }, [])

  const handleUpdate = (event) => {
    put({
      url: `/retrospectives/${retrospectiveId}/topics/${topic.id}`,
      payload: {
        label: event.currentTarget.value
      }
    })
      .then((topic) => {
        setEditing(false)
        onTopicChange(topic)
      })
      .catch(error => console.warn(error))
  }

  const handleKeyDown = (event) => {
    if (event.keyCode == 13 && !event.shiftKey) {
      event.preventDefault()
      handleUpdate(event)
    }
  }

  const handleDragStart = (event) => {
    if (!editable) return

    event.dataTransfer.setData('text/plain', event.target.dataset.id)
    event.dataTransfer.dropEffect = 'move'
    setDraggingReflection(true)
  }

  const handleDragOver = (event) => {
    if (!editable) return

    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }

  const handleDragEnd = () => setDraggingReflection(false)

  const handleDrop = (event) => {
    event.preventDefault()
    if (!editable) return

    const draggedReflectionId = event.dataTransfer.getData('text/plain')
    let targetElement = event.target

    setDraggingReflection(false)

    if (!targetElement || targetElement.id !== 'ungroup-zone') return

    put({
      url: `/retrospectives/${retrospectiveId}/topics/${topic.id}`,
      payload: {
        reflection_id: draggedReflectionId,
        remove: true
      }
    })
  }

  return (
    <div id='topic-content-backdrop' data-id={topic.id} className='fixed z-100 top-0 left-0 w-full h-full flex flex-col justify-center' onClick={handleBackdropClick} style={{ background: 'rgba(0, 0, 0, 0.8)' }}>
      <div id='topic-content' className='topic relative flex flex-row justify-evenly w-full flex-wrap'>
        {editing && <textarea name='topic_name' className='w-full flex flex-no-wrap text-white justify-center text-center bg-gray-700 mb-4 border-none outline-none overflow-hidden resize-none' ref={onEditTextAreaRefChange} defaultValue={topic.label} onKeyDown={handleKeyDown} onBlur={handleUpdate} />}
        {!editing && <div id='topic-name' className='w-full flex flex-no-wrap text-white justify-center bg-gray-700 mb-4 cursor-text' onClick={handleEditLabel}>{topic.label}<img src={EditIcon} className='edit-icon inline cursor-pointer ml-2' /></div>}
        {reflectionsInTopic.map((reflection) => {
          const concernedReactions = reactions.filter((reaction) => reaction.targetId === `Reflection-${reflection.id}`)
          return (
            <StickyNote
              key={reflection.id}
              reflection={reflection}
              noShrink
              showReactions
              draggable
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              reactions={concernedReactions} />
          )
        })}
        <div className='w-full flex justify-center text-center text-white'>
          <div id='ungroup-zone' className='w-64 h-16 bg-gray-700 flex flex-col justify-center' onDragOver={handleDragOver} onDrop={handleDrop}>
            {draggingReflection ? 'Remove from topic' : 'Drag here to remove from topic'}
          </div>
        </div>
      </div>
    </div>
  )
}

TopicExpanded.propTypes = {
  editable: PropTypes.bool,
  forceTopicEditing: PropTypes.bool,
  topic: PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
  }),
  onCollapseTopic: PropTypes.func,
  onTopicChange: PropTypes.func
}

export default TopicExpanded
