import React from 'react'
import StickyNote from './StickyNote'
import './Topic.scss'

const Topic = ({ topicId, topicLabel, reflections, reactions, stickyNotes, stickyNotesRefCallback, onDragStart, onDragOver, onDrop }) => {
  return (
    <div className='topic-container'>
      <span>{topicLabel}</span>
      <div id={topicId} data-id={topicId} className='topic'>
        {reflections.map((reflection) => {
          const concernedReactions = reactions.filter((reaction) => reaction.targetId === `Reflection-${reflection.id}`)
          const stickyNote = stickyNotes.find((stickyNote) => stickyNote.dataset.id === reflection.id)
          const isUnread = stickyNote && stickyNote.dataset.read !== 'true'

          return <StickyNote
            key={reflection.id}
            ref={stickyNotesRefCallback}
            reflection={reflection}
            showReactions
            reactions={concernedReactions}
            glowing={isUnread}
            draggable
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop} />
        })}
      </div>
    </div>
  )
}

export default Topic
