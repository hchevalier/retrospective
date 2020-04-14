import React from 'react'
import { useSelector } from 'react-redux'
import StickyNote from './StickyNote'
import StickyBookmark from './StickyBookmark'
import VoteCorner from './VoteCorner'

const ResolutionZone = () => {
  const visibleReflections = useSelector(state => state.visibleReflections)
  const currentReflection = useSelector(state => state.discussedReflection)
  const visibleReactions = useSelector(state => state.visibleReactions)

  const relevantReactions = visibleReactions.filter((reaction) => reaction.targetId === `Reflection-${currentReflection.id}`)

  const reflectionsWithVotes = visibleReflections.map((reflection) => {
    const reactions = visibleReactions.filter((reaction) => reaction.targetId === `Reflection-${reflection.id}`)
    const votes = reactions.filter((reaction) => reaction.kind === 'vote')
    return [reflection, votes]
  }).sort((a, b) => b[1].length - a[1].length)

  return (
    <div style={{ 'display': 'flex', 'flexDirection': 'row' }}>
      <div style={{ 'display': 'flex', 'flexDirection': 'column', 'flexGrow': 1, 'alignSelf': 'flex-start', 'alignItems': 'stretch' }}>
        {reflectionsWithVotes.map(([reflection, votes], index) => {
          return (
            <StickyBookmark key={index} color={reflection.color}>
              <VoteCorner reflection={reflection} votes={votes} inline noStandOut /> <span>{reflection.content}</span>
            </StickyBookmark>
          )
        })}
      </div>
      <div style={{ 'display': 'flex', 'flexGrow': 1, 'justifyContent': 'center'}}>
        <StickyNote reflection={currentReflection} showReactions showVotes reactions={relevantReactions} />
      </div>
    </div>
  )
}

export default ResolutionZone
