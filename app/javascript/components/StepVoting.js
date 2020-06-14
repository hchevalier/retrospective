import React from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import StickyNote from './StickyNote'
import Topic from './Topic'
import constants from 'lib/utils/constants'
import Icon from './Icon'

const StepVoting = () => {
  const { kind } = useSelector(state => state.retrospective)
  const reflections = useSelector(state => state.reflections.visibleReflections, shallowEqual)
  const zones = useSelector(state => state.retrospective.zones, shallowEqual)
  const ownReactions = useSelector(state => state.reactions.ownReactions, shallowEqual)
  const reactions = useSelector(state => state.reactions.visibleReactions, shallowEqual)

  const topics = {}
  const votes = ownReactions.filter((reaction) => reaction.kind === 'vote')
  const reactionsWithVotes = [...reactions, ...votes]

  return (
    <>
      <div>Remaining votes: {constants.maxVotes - votes.length}</div>
      <div id='zones-container' className="flex">
        {zones.map((zone) => (
          <div className='zone-column border flex-1 m-2 p-4 rounded first:ml-0 last:mr-0' key={zone.id}>
            <span>{<Icon retrospectiveKind={kind} zone={zone.name} />}{zone.name}</span>
            {reflections.filter((reflection) => reflection.zone.id === zone.id).map((reflection) => {
              if (reflection.topic?.id && !topics[reflection.topic.id]) {
                topics[reflection.topic.id] = reflection.topic
                const reflectionsInTopic = reflections.filter((otherReflection) => otherReflection.topic?.id === reflection.topic.id)
                const reflectionIds = reflectionsInTopic.map((otherReflection) => otherReflection.id)
                const reactionsInTopic = reactionsWithVotes.filter((reaction) => {
                  return reflectionIds.includes(reaction.targetId.split(/-(.+)?/, 2)[1]) || reaction.targetId === `Topic-${reflection.topic.id}`
                })

                return <Topic
                  key={reflection.topic.id}
                  topic={reflection.topic}
                  reflections={reflectionsInTopic}
                  reactions={reactionsInTopic}
                  showReactions
                  showVotes />
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
    </>
  )
}

export default StepVoting
