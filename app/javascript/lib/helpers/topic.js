import React from 'react'
import StickyBookmark from 'components/StickyBookmark'
import VoteCorner from 'components/VoteCorner'

export const renderTopic = ({ reflection, otherAvailableReflections, reactions, currentReflection, handleStickyBookmarkClicked}) => {
  const reflectionsInTopic = otherAvailableReflections.filter(([otherReflection]) => otherReflection.topic?.id === reflection.topic.id)
  const reflectionIds = reflectionsInTopic.map(([otherReflection]) => otherReflection.id)
  const votesInTopic = reactions.filter((reaction) => {
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
