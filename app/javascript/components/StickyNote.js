/* eslint-disable react/display-name */
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { put, destroy } from 'lib/httpClient'
import ReactionBar from './ReactionBar'
import VoteCorner from './VoteCorner'
import { reflectionShape } from 'lib/utils/shapes'
import EditIcon from 'images/edit-icon.svg'
import DeleteIcon from 'images/delete-icon.svg'
import EyeIcon from 'images/eye-icon.svg'
import './StickyNote.scss'
import './Topic.scss'

const StickyNote = React.forwardRef(({ reflection, showReactions, reactions, readOnly, showVotes, glowing, revealable, draggable, onDragStart, onDragOver, onDrop }, ref) => {
  const dispatch = useDispatch()
  const [hovered, setHovered] = React.useState(false)
  const [editing, setEditing] = React.useState(false)

  const retrospectiveId = useSelector(state => state.retrospective.id)
  const revealer = useSelector(state => state.profile.revealer)
  const step = useSelector(state => state.orchestrator.step)
  const channel = useSelector(state => state.orchestrator.subscription)

  const [editTextArea, setEditTextArea] = React.useState(null)

  const onEditTextAreaRefChange = React.useCallback(element => {
    setEditTextArea(element)
    if (element !== null) {
      element.style.height = '5px'
      element.style.height = (element.scrollHeight) + 'px'
      element.focus()
      element.setSelectionRange(element.value.length, element.value.length)
    }
  }, [])

  const resizeTextArea = () => {
    editTextArea.style.height = '5px'
    editTextArea.style.height = (editTextArea.scrollHeight) + 'px'
  }

  const handleMouseEnter = () => setHovered(true)
  const handleMouseLeave = () => setHovered(false)

  const votes = reactions.filter((reaction) => reaction.kind === 'vote')
  const emojis = reactions.filter((reaction) => reaction.kind === 'emoji')
  const displayReactionBar = hovered || emojis.length > 0

  const colorStyle = {
    borderColor: reflection.color,
    backgroundColor: reflection.color
  }

  const handleReveal = () => {
    channel.reveal(reflection.id)
  }

  const handleEdit = () => {
    if (!readOnly) setEditing(true)
  }

  const handleUpdate = (event) => {
    put({
      url: `/retrospectives/${retrospectiveId}/reflections/${reflection.id}`,
      payload: {
        content: event.currentTarget.value
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
        {editing && <textarea className='content bg-transparent border-none outline-none overflow-hidden resize-none' ref={onEditTextAreaRefChange} onChange={resizeTextArea} defaultValue={reflection.content} onBlur={handleUpdate}/>}
        {!editing && <div className='content' onClick={handleEdit}>{reflection.content}</div>}
      </div>
      {!readOnly && <div className='absolute right-0 mr-2'>
        <img src={EditIcon} className='edit-icon inline cursor-pointer mr-2' onClick={handleEdit} />
        <img src={DeleteIcon} className='delete-icon inline cursor-pointer' onClick={handleDelete} />
      </div>}
      {revealer && revealable && <div className='absolute right-0 mr-2'>
        <img src={EyeIcon} className='eye-icon inline cursor-pointer' onClick={handleReveal} width='24px' />
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
  revealable: PropTypes.bool,
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
