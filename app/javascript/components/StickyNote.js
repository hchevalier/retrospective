/* eslint-disable react/display-name */
import React from 'react'
import { useSelector } from 'react-redux'
import classNames from 'classnames'
import ReactionBar from './ReactionBar'
import VoteCorner from './VoteCorner'
import './StickyNote.scss'
import './Topic.scss'

const StickyNote = React.forwardRef(({ reflection, showReactions, reactions, showVotes, glowing, draggable }, ref) => {
  const [hovered, setHovered] = React.useState(false)

  const step = useSelector(state => state.orchestrator.step)

  const handleMouseEnter = () => setHovered(true)
  const handleMouseLeave = () => setHovered(false)

  const displayReactionBar = showReactions && (hovered || reactions.length > 0)
  const colorStyle = {
    borderColor: reflection.color,
    backgroundColor: reflection.color
  }

  const votes = reactions.filter((reaction) => reaction.kind === 'vote')
  const emojis = reactions.filter((reaction) => reaction.kind === 'emoji')

  const handleDragStart = (event) => {
    event.dataTransfer.setData('text/plain', event.target.dataset.id)
    event.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (event) => {
    event.preventDefault()
    const draggedReflectionId = event.dataTransfer.getData('text/plain')
    let targetElement = event.target
    const droppedReflection = document.querySelector(`.reflection[data-id="${draggedReflectionId}"]`)

    if (!targetElement.classList.contains('reflection') && !targetElement.classList.contains('topic')) {
      targetElement = targetElement.closest('.reflection') || targetElement.closest('topic')
    }

    if (!targetElement) return

    if (targetElement.closest('.zone-column') !== droppedReflection.closest('.zone-column')) return

    if (targetElement.classList.contains('topic')) {
      // TODO: added reflection to an existing topic, send this info to the backend
      targetElement.appendChild(droppedReflection)
    } else if (targetElement.classList.contains('reflection')) {
      const parent = targetElement.parentNode
      // dropped reflection on another reflection, check if this one is already in a topic
      if (parent.classList.contains('scrolling-zone')) {
        // TODO: no topic yet, create one and send information to the backend
        const newTopic = document.createElement('div')
        newTopic.classList.add('topic')
        parent.insertBefore(newTopic, targetElement)
        newTopic.appendChild(targetElement)
        newTopic.appendChild(droppedReflection)
      } else if (parent.classList.contains('topic')) {
        // TODO: topic already exists, add droppedReflection to it and notice the backend
        parent.appendChild(droppedReflection)
      }
    }
  }

  const handleDragOver = (event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }

  return (
    <div
      ref={ref}
      className={classNames('reflection flex flex-col mb-3 mx-auto p-2 rounded-md relative w-full', { glowing })}
      data-id={reflection.id}
      data-owner-uuid={reflection.owner.uuid}
      data-zone-id={reflection.zone.id}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={colorStyle}
      {...(draggable ? { draggable: 'true', onDragStart: handleDragStart, onDrop: handleDrop,  onDragOver: handleDragOver } : {})}>
      <div className='pb-6 reflection-content-container'>
        <div className='font-bold'>{reflection.owner.surname}</div>
        <div className='content'>{reflection.content}</div>
      </div>
      {showVotes && <VoteCorner reflection={reflection} votes={votes} canVote={step === 'voting'} />}
      <ReactionBar displayed={displayReactionBar} reflection={reflection} reactions={emojis} />
    </div>
  )
})

export default StickyNote
