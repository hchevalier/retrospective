import React from 'react'
import { useSelector } from 'react-redux'
import StickyNote from './StickyNote'

const ResolutionZone = () => {
  const currentReflection = useSelector(state => state.discussedReflection)
  const reactions = useSelector(state => state.visibleReactions)
  const ownReactions = useSelector(state => state.ownReactions)

  const votes = ownReactions.filter((reaction) => reaction.kind === 'vote')
  const relevantReactions = [...reactions, ...votes].filter((reaction) => reaction.targetId === `Reflection-${currentReflection.id}`)

  // TODO: Add a sidebar showing all reflections having at least 1 vote, sorted by descending amount of votes
  return (
    <div>
      <StickyNote reflection={currentReflection} showReactions reactions={relevantReactions} />
    </div>
  )
}

export default ResolutionZone
