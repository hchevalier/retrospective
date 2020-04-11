import React from 'react'
import { useSelector } from 'react-redux'
import StickyNote from './StickyNote'

const ReflectionsVoting = () => {
  const reflections = useSelector(state => state.visibleReflections)
  const zones = useSelector(state => state.retrospective.zones)
  const ownReactions = useSelector(state => state.ownReactions)

  const MAX_VOTES = 5

  return (
    <>
      <div>Remaining votes: {MAX_VOTES - ownReactions.filter((reaction) => reaction.kind === 'vote').length}</div>
      <div id='zones-container'>
        {zones.map((zone) => (
          <div className='zone-column' key={zone.id}>
            <span>{zone.name}</span>
            {reflections.filter((reflection) => reflection.zone.id === zone.id).map((reflection) => {
              const reactions = ownReactions.filter((reaction) => reaction.targetId === `Reflection-${reflection.id}`) || []
              return <StickyNote
                key={reflection.id}
                reflection={reflection}
                showReactions
                reactions={reactions} />
            })}
          </div>
        ))}
      </div>
    </>
  )
}

export default ReflectionsVoting
