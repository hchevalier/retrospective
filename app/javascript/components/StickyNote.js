import React from 'react'
import { useSelector } from 'react-redux'
import classNames from 'classnames'
import ReactionBar from './ReactionBar'
import VoteCorner from './VoteCorner'
import './StickyNote.scss'

const StickyNote = ({ reflection, showReactions, reactions, showVotes, glowing }) => {
  const [hovered, setHovered] = React.useState(false)

  const step = useSelector(state => state.step)

  const handleMouseEnter = () => setHovered(true)
  const handleMouseLeave = () => setHovered(false)

  const displayReactionBar = showReactions && (hovered || reactions.length > 0)
  const colorStyle = {
    borderColor: reflection.color,
    backgroundColor: reflection.color
  }

  const votes = reactions.filter((reaction) => reaction.kind === 'vote')
  const emojis = reactions.filter((reaction) => reaction.kind === 'emoji')

  return (
    <div className={classNames('reflection', { glowing })} data-id={reflection.id} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={colorStyle}>
      <div className='reflection-content-container'>
        <div className='author'>{reflection.owner.surname}</div>
        <div className='content'>{reflection.content}</div>
      </div>
      {showVotes && <VoteCorner reflection={reflection} votes={votes} canVote={step === 'voting'} />}
      <ReactionBar displayed={displayReactionBar} reflection={reflection} reactions={emojis} />
    </div>
  )
}

export default StickyNote
