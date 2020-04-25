import React from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import StickyNote from './StickyNote'
import constants from 'lib/utils/constants'

const StepVoting = () => {
  const reflections = useSelector(state => state.visibleReflections, shallowEqual)
  const zones = useSelector(state => state.retrospective.zones, shallowEqual)
  const ownReactions = useSelector(state => state.ownReactions, shallowEqual)
  const reactions = useSelector(state => state.visibleReactions, shallowEqual)

  const votes = ownReactions.filter((reaction) => reaction.kind === 'vote')

  return (
    <>
      <div>Remaining votes: {constants.maxVotes - votes.length}</div>
      <div id='zones-container'>
        {zones.map((zone) => (
          <div className='zone-column' key={zone.id}>
            <span>{zone.name}</span>
            {reflections.filter((reflection) => reflection.zone.id === zone.id).map((reflection) => {
              const relevantReactions = [...reactions, ...votes].filter((reaction) => reaction.targetId === `Reflection-${reflection.id}`)
              return <StickyNote
                key={reflection.id}
                reflection={reflection}
                showReactions
                showVotes
                reactions={relevantReactions} />
            })}
          </div>
        ))}
      </div>
    </>
  )
}

export default StepVoting
