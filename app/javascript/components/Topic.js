import React from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import StickyNote from './StickyNote'
import VoteCorner from './VoteCorner'
import './Topic.scss'

const Topic = ({ onClick, topic, reflections, reactions, stickyNotes, stickyNotesRefCallback, showVotes, ...delegatedAttributes }) => {
  const step = useSelector(state => state.orchestrator.step)

  const votes = reactions.filter((reaction) => reaction.kind === 'vote')

  const reflectionIds = reflections.map((reflection) => reflection.id)
  const sortedReflections = reflections.sort((reflectionA, reflectionB) => reflectionA.updatedAt - reflectionB.updatedAt)
  const latestReflectionInTopic = sortedReflections[sortedReflections.length - 1]

  const concernedReactions = reactions.filter((reaction) => reaction.targetId === `Reflection-${latestReflectionInTopic.id}`)
  const unreadNotes = (stickyNotes || []).filter((stickyNote) => reflectionIds.includes(stickyNote.dataset.id) && stickyNote.dataset.read !== 'true')

  return (
    <div className='topic-container relative p-4' onClick={() => onClick && onClick(topic)}>
      <div className='topic-label font-bold inline-block mb-3'>{topic.label}</div>
      {showVotes && <VoteCorner target={topic} targetType={'topic'} votes={votes} canVote={step === 'voting'} />}
      <div id={topic.id} data-id={topic.id} className='topic relative flex flex-row justify-center'>
        <StickyNote
          key={latestReflectionInTopic.id}
          ref={stickyNotesRefCallback}
          reflection={latestReflectionInTopic}
          reactions={concernedReactions}
          glowing={unreadNotes.length > 0}
          stackSize={reflections.length}
          {...delegatedAttributes} />
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
  onClick: PropTypes.func,
  onDragStart: PropTypes.func,
  onDragOver: PropTypes.func,
  onDrop: PropTypes.func
}

export default Topic
