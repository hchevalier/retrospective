import React from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import StickyNote from './StickyNote'
import VoteCorner from './VoteCorner'
import './Topic.scss'

const Topic = ({ topic, reflections, reactions, stickyNotes, stickyNotesRefCallback, showVotes, ...delegatedAttributes }) => {
  const step = useSelector(state => state.orchestrator.step)

  const votes = reactions.filter((reaction) => reaction.kind === 'vote')

  return (
    <div className='topic-container relative'>
      <div className='topic-label font-bold inline-block mb-3'>{topic.label}</div>
      {showVotes && <VoteCorner target={topic} targetType={'topic'} votes={votes} canVote={step === 'voting'} />}
      <div id={topic.id} data-id={topic.id} className='topic'>
        {reflections.map((reflection) => {
          const concernedReactions = reactions.filter((reaction) => reaction.targetId === `Reflection-${reflection.id}`)
          const stickyNote = (stickyNotes || []).find((stickyNote) => stickyNote.dataset.id === reflection.id)
          const isUnread = stickyNote && stickyNote.dataset.read !== 'true'

          return <StickyNote
            key={reflection.id}
            ref={stickyNotesRefCallback}
            reflection={reflection}
            reactions={concernedReactions}
            glowing={isUnread}
            {...delegatedAttributes} />
        })}
      </div>
    </div>
  )
}

Topic.propTypes = {
  topic: PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
  }),
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
  draggable: PropTypes.bool,
  onDragStart: PropTypes.func,
  onDragOver: PropTypes.func,
  onDrop: PropTypes.func
}

export default Topic
