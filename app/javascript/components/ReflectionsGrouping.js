import React from 'react'
import { useSelector } from 'react-redux'
import StickyNote from './StickyNote'
import './ReflectionsGrouping.scss'

const ReflectionsGrouping = () => {
  const reflections = useSelector(state => state.visibleReflections)
  const zones = useSelector(state => state.retrospective.zones)
  const organizer = useSelector(state => state.profile.organizer)

  return (
    <>
      {organizer && <div>Click on a participant so that he can reveal his reflections</div>}
      <div id='zones-container'>
        {zones.map((zone) => (
          <div className='zone-column' key={zone.id}>
            <span>{zone.name}</span>
            {reflections.filter((reflection) => reflection.zone.id === zone.id).map((reflection) => {
              return <StickyNote key={reflection.id} reflection={reflection} />
            })}
          </div>
        ))}
      </div>
    </>
  )
}

export default ReflectionsGrouping
