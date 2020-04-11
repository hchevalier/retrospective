import React from 'react'
import ReactionBar from './ReactionBar'
import './StickyNote.scss'
import { useSelector } from 'react-redux'

const StickyNote = ({ reflection, showReactions, reactions }) => {
  const [hovered, setHovered] = React.useState(false)

  const handleMouseEnter = React.useCallback(() => setHovered(true))
  const handleMouseLeave = React.useCallback(() => setHovered(false))

  const displayReactionBar = showReactions && (hovered || reactions.length > 0)
  const colorStyle = {
    borderColor: reflection.color,
    backgroundColor: reflection.color
  }

  return (
    <div className='reflection' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={colorStyle}>
      <div className='reflection-content-container'>
        <div className='author'>{reflection.owner.surname}</div>
        <div className='content'>{reflection.content}</div>
      </div>
      <ReactionBar displayed={displayReactionBar} reflection={reflection} reactions={reactions} />
    </div>
  )
}

export default StickyNote
