import React from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import StickyNote from './StickyNote'
import StickyBookmark from './StickyBookmark'
import VoteCorner from './VoteCorner'
import ActionEditor from './ActionEditor'
import './StepActions.scss'

const StepActions = () => {
  const { organizer } = useSelector(state => state.profile)
  const visibleReflections = useSelector(state => state.reflections.visibleReflections, shallowEqual)
  const currentReflection = useSelector(state => state.reflections.discussedReflection)
  const visibleReactions = useSelector(state => state.reactions.visibleReactions, shallowEqual)
  const channel = useSelector(state => state.orchestrator.subscription)

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
  }, [organizer, channel])

  if (!currentReflection) return null

  return (
    <div id='actions-zone'>
      <div id='reflections-panel'>
        <div id='discussed-reflection'>
          <StickyNote reflection={currentReflection} showReactions showVotes reactions={relevantReactions} />
        </div>
        <div id='reflections-list'>
          {reflectionsWithVotes.map(([reflection, votes], index) => {
            let selected = reflection.id == currentReflection.id ? "shadow-md" : "mx-2"
            return (
              <StickyBookmark key={index} color={reflection.color} otherClassNames={selected} onClick={() => handleStickyBookmarkClicked(reflection)}>
                <VoteCorner target={reflection} targetType={'reflection'} votes={votes} inline noStandOut /> <span>{reflection.content}</span>
              </StickyBookmark>
            )
          })}
        </div>
      </div>
      <div id='action-editor-container'>
        <ActionEditor reflectionId={currentReflection.id} reflectionContent={currentReflection.content} />
      </div>
    </div>
  )
}

export default StepActions
