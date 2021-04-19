import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import StickyNote from './StickyNote'

const StickyNotesStack = ({ onClick, reflections, onDragStart, onDragOver, onDragEnd, onDrop }) => {
  const [visibleReflectionIndex, setVisibleReflectionIndex] = useState(0)

  const sortedReflections = reflections.sort((reflectionA, reflectionB) => reflectionA.updatedAt - reflectionB.updatedAt)
  const cycleIndex = visibleReflectionIndex % sortedReflections.length
  const latestReflectionInTopic = sortedReflections[cycleIndex]

  useEffect(() => setVisibleReflectionIndex(sortedReflections.length - 1), [sortedReflections.length])

  const handleCycleLeftClick = (event) => {
    event.stopPropagation()
    const newIndex = visibleReflectionIndex - 1
    setVisibleReflectionIndex(newIndex < 0 ? sortedReflections.length - 1 : newIndex % sortedReflections.length)
  }

  const handleCycleRightClick = (event) => {
    event.stopPropagation()
    const newIndex = visibleReflectionIndex + 1
    setVisibleReflectionIndex(newIndex % sortedReflections.length)
  }

  const isRealStack = reflections.length > 1

  return (
    <div className='sticky-notes-stack-container relative h-full' onClick={() => onClick && onClick(reflections[0].zone.id)}>
      <div className={classNames('sticky-notes-stack relative flex flex-row justify-center h-full', { 'mx-2': !isRealStack })}>
        {isRealStack && <div className='cursor-pointer self-center select-none' onClick={handleCycleLeftClick}>{'<'}</div>}
        <StickyNote
          key={latestReflectionInTopic.id}
          hideAuthor
          readOnly
          draggable
          maxLines={6}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
          onDrop={onDrop}
          reflection={latestReflectionInTopic} />
        {isRealStack && <div className='cursor-pointer self-center select-none' onClick={handleCycleRightClick}>{'>'}</div>}
      </div>
    </div>
  )
}

StickyNotesStack.propTypes = {
  reflections: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    topic: PropTypes.object,
    zone: PropTypes.object.isRequired,
    color: PropTypes.string.isRequired,
    revealed: PropTypes.bool,
    content: PropTypes.string.isRequired,
    owner: PropTypes.shape({
      uuid: PropTypes.string.isRequired,
      surname: PropTypes.string.isRequired
    }).isRequired
  })).isRequired,
  stickyNotes: PropTypes.arrayOf(Element),
  stickyNotesRefCallback: PropTypes.func,
  showReactions: PropTypes.bool,
  reactions: PropTypes.arrayOf(Object),
  showVotes: PropTypes.bool,
  glowing: PropTypes.bool,
  draggingInfo: PropTypes.shape({
    reflection: PropTypes.string,
    zone: PropTypes.string
  }),
  draggable: PropTypes.bool,
  onClick: PropTypes.func,
  onDragStart: PropTypes.func,
  onDragOver: PropTypes.func,
  onDragEnd: PropTypes.func,
  onDrop: PropTypes.func
}

export default StickyNotesStack
