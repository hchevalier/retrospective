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

  const relevantReactions = visibleReactions.filter((reaction) => {
    return reaction.targetId === `Reflection-${currentReflection.id}` ||  reaction.targetId === `Topic-${currentReflection.topic?.id}`
  })

  const reflectionsWithVotes = visibleReflections.map((reflection) => {
    const reactions = visibleReactions.filter((reaction) => {
      return reaction.targetId === `Reflection-${reflection.id}` || reaction.targetId === `Topic-${reflection.topic?.id}`
    })
    const votes = reactions.filter((reaction) => reaction.kind === 'vote')
    return [reflection, votes]
  }).sort((a, b) => b[1].length - a[1].length)

  const handleStickyBookmarkClicked = React.useCallback((reflection) => {
    if (organizer) {
      channel.changeDiscussedReflection(reflection.id)
    }
  }, [organizer, channel])

  const renderTopic = (reflection) => {
    const reflectionsInTopic = reflectionsWithVotes.filter(([otherReflection]) => otherReflection.topic?.id === reflection.topic.id)
    const reflectionIds = reflectionsInTopic.map(([otherReflection]) => otherReflection.id)
    const votesInTopic = visibleReactions.filter((reaction) => {
      return reflectionIds.includes(reaction.targetId.split(/-(.+)?/, 2)[1]) || reaction.targetId === `Topic-${reflection.topic.id}`
    }).filter((reaction) => reaction.kind === 'vote')
    let selected = reflectionIds.includes(currentReflection.id) ? 'shadow-md' : 'mx-2'
    return (
      <div key={reflection.topic.id}>
        <StickyBookmark color={'whitesmoke'} otherClassNames={selected} onClick={() => handleStickyBookmarkClicked(reflection)}>
          <VoteCorner target={reflection.reflection} targetType={'topic'} votes={votesInTopic} inline noStandOut /> <span>{reflection.topic.label}</span>
        </StickyBookmark>
        {reflectionsInTopic.map(([otherReflection]) => {
          return (
            <StickyBookmark key={otherReflection.id} color={otherReflection.color} otherClassNames={'ml-8'} onClick={() => handleStickyBookmarkClicked(otherReflection)}>
              {otherReflection.content}
            </StickyBookmark>
          )
        })}
      </div>
    )
  }

  if (!currentReflection) return null

  const topics = {}

  return (
    <div id='actions-zone'>
      <div id='reflections-panel'>
        <div id='discussed-reflection'>
          <StickyNote reflection={currentReflection} showReactions showVotes reactions={relevantReactions} />
        </div>
        <div id='reflections-list'>
          {reflectionsWithVotes.map(([reflection, votes]) => {
            if (reflection.topic?.id && !topics[reflection.topic.id]) {
              topics[reflection.topic.id] = reflection.topic
              return renderTopic(reflection)
            } else if (!reflection.topic?.id) {
              let selected = reflection.id == currentReflection.id ? 'shadow-md' : 'mx-2'
              return (
                <StickyBookmark key={reflection.id} color={reflection.color} otherClassNames={selected} onClick={() => handleStickyBookmarkClicked(reflection)}>
                  <VoteCorner target={reflection} targetType={'reflection'} votes={votes} inline noStandOut /> <span>{reflection.content}</span>
                </StickyBookmark>
              )
            }
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
