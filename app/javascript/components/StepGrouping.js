import React from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import StickyNote from './StickyNote'
import Icon from './Icon'
import './StepGrouping.scss'

const StepGrouping = () => {
  const { kind } = useSelector(state => state.retrospective)
  const reflections = useSelector(state => state.reflections.visibleReflections, shallowEqual)
  const zones = useSelector(state => state.retrospective.zones, shallowEqual)
  const organizer = useSelector(state => state.profile.organizer)
  const reactions = useSelector(state => state.reactions.visibleReactions, shallowEqual)

  return (
    <>
      {organizer && <div>Click on a participant so that he can reveal his reflections</div>}
      {!organizer && <div>The organizer now chooses a participant so that he can reveal his reflections</div>}
      <div id='zones-container'>
        {zones.map((zone) => (
          <div className='zone-column' key={zone.id}>
            <span>{<Icon retrospectiveKind={kind} zone={zone.name} />}{zone.name}</span>
            {reflections.filter((reflection) => reflection.zone.id === zone.id).map((reflection) => {
              const concernedReactions = reactions.filter((reaction) => reaction.targetId === `Reflection-${reflection.id}`)
              return <StickyNote key={reflection.id} reflection={reflection} showReactions reactions={concernedReactions} />
            })}
          </div>
        ))}
      </div>
    </>
  )
}

export default StepGrouping
