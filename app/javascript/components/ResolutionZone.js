import React from 'react'
import { useSelector } from 'react-redux'
import StickyNote from './StickyNote'

const ResolutionZone = () => {
  const currentReflection = useSelector(state => state.discussedReflection)

  // TODO: Add a sidebar showing all reflections having at least 1 vote, sorted by descending amount of votes
  return (
    <div>
      <StickyNote reflection={currentReflection} />
    </div>
  )
}

export default ResolutionZone
