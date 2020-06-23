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
import './StickyNote.scss'
import './Topic.scss'

const StickyNote = React.forwardRef(({ reflection, showReactions, reactions, readOnly, showVotes, glowing, draggable, onDragStart, onDragOver, onDrop }, ref) => {
  const dispatch = useDispatch()
  const [hovered, setHovered] = React.useState(false)
  const [editing, setEditing] = React.useState(false)

  const retrospectiveId = useSelector(state => state.retrospective.id)
  const step = useSelector(state => state.orchestrator.step)

  const [editTextArea, setEditTextArea] = React.useState(null)

  const onEditTextAreaRefChange = React.useCallback(element => {
    setEditTextArea(element)
    if (element !== null) {
      element.focus()
      element.setSelectionRange(element.value.length, element.value.length)
    }
  }, [])

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
        {editing && <textarea className='content' ref={onEditTextAreaRefChange} defaultValue={reflection.content} onBlur={handleUpdate}/>}
        {!editing && <div className='content'>{reflection.content}</div>}
      </div>
      {!readOnly && <div className='absolute right-0 mr-2'>
        <img src={EditIcon} className='edit-icon inline mr-2' onClick={handleEdit} />
        <img src={DeleteIcon} className='delete-icon inline' onClick={handleDelete} />
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
