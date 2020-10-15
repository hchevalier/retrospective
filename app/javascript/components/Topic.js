import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import StickyNote from './StickyNote'
import VoteCorner from './VoteCorner'
import './Topic.scss'

const Topic = ({ onClick, topic, reflections, reactions, draggingInfo, stickyNotes, stickyNotesRefCallback, showVotes, ...delegatedAttributes }) => {
  const step = useSelector(state => state.orchestrator.step)

  const [visibleReflectionIndex, setVisibleReflectionIndex] = useState(0)

  const votes = reactions.filter((reaction) => reaction.kind === 'vote')

  const reflectionIds = reflections.map((reflection) => reflection.id)
  const sortedReflections = reflections.sort((reflectionA, reflectionB) => reflectionA.updatedAt - reflectionB.updatedAt)
  const cycleIndex = visibleReflectionIndex % sortedReflections.length
  const latestReflectionInTopic = sortedReflections[cycleIndex]

  useEffect(() => setVisibleReflectionIndex(sortedReflections.length - 1), [sortedReflections.length])

  const concernedReactions = reactions.filter((reaction) => reaction.targetId === `Reflection-${latestReflectionInTopic.id}`)
  const unreadNotes = (stickyNotes || []).filter((stickyNote) => reflectionIds.includes(stickyNote.dataset.id) && stickyNote.dataset.read !== 'true')

  const handleStackClick = (event) => {
    event.stopPropagation()
    const newIndex = visibleReflectionIndex + 1
    setVisibleReflectionIndex(newIndex % sortedReflections.length)
  }

  return (
    <div className='topic-container relative p-4 my-2' onClick={() => onClick && onClick(topic)}>
      <div className='topic-label font-bold inline-block mb-3' onClick={(event) => { event.stopPropagation(); onClick && onClick(topic, true) }}>{topic.label}</div>
      {showVotes && <VoteCorner target={topic} targetType={'topic'} votes={votes} canVote={step === 'voting'} />}
      <div id={topic.id} data-id={topic.id} className='topic relative flex flex-row justify-center'>
        <StickyNote
          key={latestReflectionInTopic.id}
          ref={stickyNotesRefCallback}
          reflection={latestReflectionInTopic}
          reactions={concernedReactions}
          glowing={unreadNotes.length > 0}
          highlighted={draggingInfo?.zone === latestReflectionInTopic.zone.id.toString() && draggingInfo?.reflection !== latestReflectionInTopic.id.toString()}
          onStackClick={handleStackClick}
          stackSize={reflections.length}
          {...delegatedAttributes} />
      </div>
      <div className='circles flex flex-row justify-center cursor-pointer h-4' onClick={handleStackClick}>
        {reflectionIds.map((reflectionId, index) => {
          return <div key={reflectionId} className={classNames('rounded-full p-1 bg-gray-400 mx-1 h-2', { 'bg-gray-600': index === cycleIndex })} />
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

export default Topic
