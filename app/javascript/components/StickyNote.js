/* eslint-disable react/display-name */
import React from 'react'
import { useSelector } from 'react-redux'
import classNames from 'classnames'
import ReactionBar from './ReactionBar'
import VoteCorner from './VoteCorner'
import './StickyNote.scss'
import './Topic.scss'

const StickyNote = React.forwardRef(({ reflection, showReactions, reactions, showVotes, glowing, draggable, onDragStart, onDragOver, onDrop }, ref) => {
  const [hovered, setHovered] = React.useState(false)

  const step = useSelector(state => state.orchestrator.step)

  const handleMouseEnter = () => setHovered(true)
  const handleMouseLeave = () => setHovered(false)

  const votes = reactions.filter((reaction) => reaction.kind === 'vote')
  const emojis = reactions.filter((reaction) => reaction.kind === 'emoji')
  const displayReactionBar = showReactions && (hovered || emojis.length > 0)

  const colorStyle = {
    borderColor: reflection.color,
    backgroundColor: reflection.color
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
      <div className='pb-6 reflection-content-container'>
        <div className='font-bold'>{reflection.owner.surname}</div>
        <div className='content'>{reflection.content}</div>
      </div>
      {showVotes && <VoteCorner target={reflection} targetType={'reflection'} votes={votes} canVote={step === 'voting'} />}
      <ReactionBar displayed={displayReactionBar} reflection={reflection} reactions={emojis} />
    </div>
  )
})

export default StickyNote
