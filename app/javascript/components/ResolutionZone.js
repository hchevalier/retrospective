import React from 'react'
import { useSelector } from 'react-redux'
import StickyNote from './StickyNote'

const ResolutionZone = () => {
  const currentReflection = useSelector(state => state.discussedReflection)
  const ownReactions = useSelector(state => state.ownReactions)
  // TODO: handle visible reactions

  const reactions = ownReactions.filter((reaction) => reaction.targetId === `Reflection-${currentReflection.id}`) || []

  // TODO: Add a sidebar showing all reflections having at least 1 vote, sorted by descending amount of votes
  return (
    <div>
      <StickyNote reflection={currentReflection} showReactions reactions={reactions} />
    </div>
  )
}

export default ResolutionZone
