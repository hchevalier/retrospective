import React from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import PropTypes from 'prop-types'
import constants from 'lib/utils/constants'
import Card from './Card'
import StickyNote from './StickyNote'
import Topic from './Topic'
import Icon from './Icon'

const StepVoting = ({ onExpandTopic }) => {
  const { kind } = useSelector(state => state.retrospective)
  const reflections = useSelector(state => state.reflections.visibleReflections, shallowEqual)
  const zones = useSelector(state => state.retrospective.zones, shallowEqual)
  const ownReactions = useSelector(state => state.reactions.ownReactions, shallowEqual)
  const reactions = useSelector(state => state.reactions.visibleReactions, shallowEqual)

  const topics = {}
  const votes = ownReactions.filter((reaction) => reaction.kind === 'vote')
  const reactionsWithVotes = [...reactions, ...votes]

  const renderTopic = (reflection) => {
    const reflectionsInTopic = reflections.filter((otherReflection) => otherReflection.topic?.id === reflection.topic.id)
    const reflectionIds = reflectionsInTopic.map((otherReflection) => otherReflection.id)
    const reactionsInTopic = reactionsWithVotes.filter((reaction) => {
      return reflectionIds.includes(reaction.targetId.split(/-(.+)?/, 2)[1]) || reaction.targetId === `Topic-${reflection.topic.id}`
    })

    return <Topic
      key={reflection.topic.id}
      onClick={onExpandTopic}
      topic={reflection.topic}
      reflections={reflectionsInTopic}
      reactions={reactionsInTopic}
      showReactions
      showVotes />
  }

  return (
    <Card
      vertical
      className='pb-0 h-full'
      containerClassName='flex-1 px-4 h-full'>
      <div>Remaining votes: {constants.maxVotes - votes.length}</div>
      <div id='zones-container' className="flex w-full h-full overflow-x-scroll">
        {zones.map((zone) => (
          <div className='zone-column border flex-1 m-2 p-4 rounded first:ml-0 last:mr-0 relative min-w-12' key={zone.id}>
            <div className='zone-header mb-4'>{<Icon retrospectiveKind={kind} zone={zone.name} />}{zone.name}</div>
            {reflections.filter((reflection) => reflection.zone.id === zone.id).map((reflection) => {
              if (reflection.topic?.id && !topics[reflection.topic.id]) {
                topics[reflection.topic.id] = reflection.topic
                return renderTopic(reflection)
              } else if (!reflection.topic?.id) {
                const relevantReactions = reactionsWithVotes.filter((reaction) => reaction.targetId === `Reflection-${reflection.id}`)

                return <StickyNote
                  key={reflection.id}
                  reflection={reflection}
                  showReactions
                  showVotes
                  reactions={relevantReactions} />
              }
            })}
          </div>
        ))}
      </div>
    </Card>
  )
}

StepVoting.propTypes = {
  onExpandTopic: PropTypes.func
}

export default StepVoting
