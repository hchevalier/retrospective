/* eslint-disable react/display-name */
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { put, destroy } from 'lib/httpClient'
import ReactionBar from './ReactionBar'
import VoteCorner from './VoteCorner'
import { reflectionShape } from 'lib/utils/shapes'
import './StickyNote.scss'
import './Topic.scss'

const StickyNote = React.forwardRef(({ reflection, showReactions, reactions, readOnly, showVotes, glowing, draggable, onDragStart, onDragOver, onDrop }, ref) => {
  const dispatch = useDispatch()
  const [hovered, setHovered] = React.useState(false)
  const [editing, setEditing] = React.useState(false)

  const retrospectiveId = useSelector(state => state.retrospective.id)
  const step = useSelector(state => state.orchestrator.step)

  const editTextArea = React.useRef(null)

  const handleMouseEnter = () => setHovered(true)
  const handleMouseLeave = () => setHovered(false)

  const votes = reactions.filter((reaction) => reaction.kind === 'vote')
  const emojis = reactions.filter((reaction) => reaction.kind === 'emoji')
  const displayReactionBar = hovered || emojis.length > 0

  const colorStyle = {
    borderColor: reflection.color,
    backgroundColor: reflection.color
  }

  const handleEdit = () => {
    setEditing(true)
  }

  const handleUpdate = () => {
    put({
      url: `/retrospectives/${retrospectiveId}/reflections/${reflection.id}`,
      payload: {
        content: editTextArea.current.value
      }
    })
      .then(updatedReflection => {
        dispatch({ type: 'change-reflection', reflection: updatedReflection })
        setEditing(false)
      })
      .catch(error => console.warn(error))
  }

  const handleDelete = () => {
    destroy({ url: `/retrospectives/${retrospectiveId}/reflections/${reflection.id}` })
      .then(() => {
        dispatch({ type: 'delete-reflection', reflectionId: reflection.id })
      })
      .catch(error => console.warn(error))
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
      {...(draggable ? { draggable, onDragStart, onDrop, onDragOver } : {})}>
      <div className='reflection-content-container'>
        <div className='font-bold mb-2'>{reflection.owner.surname}</div>
        {editing && <textarea className='content' ref={editTextArea} defaultValue={reflection.content} onBlur={handleUpdate}/>}
        {!editing && <div className='content'>{reflection.content}</div>}
      </div>
      {!readOnly && <div className='px-6 pb-4'>
        <span className='inline-block bg-gray-200 rounded-full px-3 py-1 mr-2'>
          <svg className='edit-icon' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='20' height='20' onClick={handleEdit}>
            <path className='heroicon-ui' d='M6.3 12.3l10-10a1 1 0 0 1 1.4 0l4 4a1 1 0 0 1 0 1.4l-10 10a1 1 0 0 1-.7.3H7a1 1 0 0 1-1-1v-4a1 1 0 0 1 .3-.7zM8 16h2.59l9-9L17 4.41l-9 9V16zm10-2a1 1 0 0 1 2 0v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6c0-1.1.9-2 2-2h6a1 1 0 0 1 0 2H4v14h14v-6z' />
          </svg>
        </span>
        <span className='inline-block bg-gray-200 rounded-full px-3 py-1'>
          <svg className='delete-icon' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='20' height='20' onClick={handleDelete}>
            <path className='heroicon-ui' d='M8 6V4c0-1.1.9-2 2-2h4a2 2 0 0 1 2 2v2h5a1 1 0 0 1 0 2h-1v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8H3a1 1 0 1 1 0-2h5zM6 8v12h12V8H6zm8-2V4h-4v2h4zm-4 4a1 1 0 0 1 1 1v6a1 1 0 0 1-2 0v-6a1 1 0 0 1 1-1zm4 0a1 1 0 0 1 1 1v6a1 1 0 0 1-2 0v-6a1 1 0 0 1 1-1z' />
          </svg>
        </span>
      </div>}
      {showVotes && <VoteCorner target={reflection} targetType={'reflection'} votes={votes} canVote={step === 'voting'} />}
      {showReactions && <ReactionBar displayed={displayReactionBar} reflection={reflection} reactions={emojis} />}
    </div>
  )
})

StickyNote.propTypes = {
  reflection: reflectionShape.isRequired,
  showReactions: PropTypes.bool,
  reactions: PropTypes.arrayOf(Object),
  readOnly: PropTypes.bool,
  showVotes: PropTypes.bool,
  glowing: PropTypes.bool,
  draggable: PropTypes.bool,
  onDragStart: PropTypes.func,
  onDragOver: PropTypes.func,
  onDrop: PropTypes.func
}

StickyNote.defaultProps = {
  reactions: [],
  readOnly: true
}

export default StickyNote
