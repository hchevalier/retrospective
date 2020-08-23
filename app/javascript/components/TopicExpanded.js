import React from 'react'
import PropTypes from 'prop-types'
import { useSelector, shallowEqual } from 'react-redux'
import StickyNote from './StickyNote'
import './Topic.scss'

const TopicExpanded = ({ topic, onCollapseTopic }) => {
  const reflections = useSelector(state => state.reflections.visibleReflections, shallowEqual)
  const visibleReactions = useSelector(state => state.reactions.visibleReactions, shallowEqual)

  const reflectionsInTopic = reflections.filter((reflection) => reflection.topic?.id === topic.id)
  const reflectionIds = reflectionsInTopic.map((reflection) => reflection.id)
  const reactions = visibleReactions.filter((reaction) => reflectionIds.includes(reaction.targetId.split(/-(.+)?/, 2)[1]))

  return (
    <>
      <div className='absolute w-full h-full top-0 left-0' style={{ background: 'rgba(0, 0, 0, 0.8)' }} />
      <div id='topic-content-backdrop' data-id={topic.id} className='absolute w-full h-full flex flex-col justify-center' onClick={onCollapseTopic} >
        <div id='topic-content' className='topic relative flex flex-row justify-evenly w-full flex-wrap'>
          {reflectionsInTopic.map((reflection) => {
            const concernedReactions = reactions.filter((reaction) => reaction.targetId === `Reflection-${reflection.id}`)
            return (
              <StickyNote
                key={reflection.id}
                reflection={reflection}
                noShrink
                showReactions
                reactions={concernedReactions} />
            )
          })}
        </div>
      </div>
    </>
  )
}

export default TopicExpanded
