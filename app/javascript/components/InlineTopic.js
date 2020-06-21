import React from 'react'
import StickyBookmark from 'components/StickyBookmark'
import VoteCorner from 'components/VoteCorner'
import PropTypes from 'prop-types'

const InlineTopic = ({ reflection, allReflections, reactions, selectedReflection, onItemClick }) => {
  const reflectionsInTopic = allReflections.filter(([otherReflection]) => otherReflection.topic?.id === reflection.topic.id)
  const reflectionIds = reflectionsInTopic.map(([otherReflection]) => otherReflection.id)
  const votesInTopic = reactions.filter((reaction) => {
    return reflectionIds.includes(reaction.targetId.split(/-(.+)?/, 2)[1]) || reaction.targetId === `Topic-${reflection.topic.id}`
  }).filter((reaction) => reaction.kind === 'vote')
  let selected = reflectionIds.includes(selectedReflection.id) ? 'shadow-md' : 'mx-2'

  return (
    <div key={reflection.topic.id}>
      <StickyBookmark color={'whitesmoke'} otherClassNames={selected} onClick={() => onItemClick(reflection)}>
        <VoteCorner target={reflection.reflection} targetType={'topic'} votes={votesInTopic} inline noStandOut /> <span>{reflection.topic.label}</span>
      </StickyBookmark>
      {reflectionsInTopic.map(([otherReflection]) => {
        return (
          <StickyBookmark key={otherReflection.id} color={otherReflection.color} otherClassNames={'ml-8'} onClick={() => onItemClick(otherReflection)}>
            {otherReflection.content}
          </StickyBookmark>
        )
      })}
    </div>
  )
}

const reflectionShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  topic: PropTypes.shape({
    id: PropTypes.string.isRequired
  })
})

const reactionShape = PropTypes.shape({
  targetId: PropTypes.string,
})

InlineTopic.propTypes = {
  reflection: reflectionShape,
  allReflections: PropTypes.arrayOf(reflectionShape),
  selectedReflection: reflectionShape,
  reactions: PropTypes.arrayOf(reactionShape),
  onItemClick: PropTypes.func
}

export default InlineTopic
