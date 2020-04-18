import React from 'react'
import { useSelector } from 'react-redux'
import StickyNote from './StickyNote'
import StickyBookmark from './StickyBookmark'
import VoteCorner from './VoteCorner'
import ActionEditor from './ActionEditor'
import './ResolutionZone.scss'

const ResolutionZone = () => {
  const { organizer } = useSelector(state => state.profile)
  const visibleReflections = useSelector(state => state.visibleReflections)
  const currentReflection = useSelector(state => state.discussedReflection)
  const visibleReactions = useSelector(state => state.visibleReactions)
  const channel = useSelector(state => state.orchestrator)

  const relevantReactions = visibleReactions.filter((reaction) => reaction.targetId === `Reflection-${currentReflection.id}`)

  const reflectionsWithVotes = visibleReflections.map((reflection) => {
    const reactions = visibleReactions.filter((reaction) => reaction.targetId === `Reflection-${reflection.id}`)
    const votes = reactions.filter((reaction) => reaction.kind === 'vote')
    return [reflection, votes]
  }).sort((a, b) => b[1].length - a[1].length)

  const handleStickyBookmarkClicked = React.useCallback((reflection) => {
    if (organizer) {
      channel.changeDiscussedReflection(reflection.id)
    }
  })

  return (
    <div style={{ 'display': 'flex', 'flexDirection': 'row' }}>
      <div style={{ 'display': 'flex', 'flexDirection': 'column', 'flexGrow': 1 }}>
        <div style={{ 'display': 'flex', 'flexGrow': 1, 'justifyContent': 'center' }}>
          <StickyNote reflection={currentReflection} showReactions showVotes reactions={relevantReactions} />
        </div>
        <div id='reflections-list'>
          {reflectionsWithVotes.map(([reflection, votes], index) => {
            return (
              <StickyBookmark key={index} color={reflection.color} onClick={() => handleStickyBookmarkClicked(reflection)}>
                <VoteCorner reflection={reflection} votes={votes} inline noStandOut /> <span>{reflection.content}</span>
              </StickyBookmark>
            )
          })}
        </div>
      </div>
      <div id='action-editor-container'>
        <ActionEditor reflection={currentReflection} />
      </div>
    </div>
  )
}

export default ResolutionZone
