import React from 'react'
import { useSelector } from 'react-redux'
import StickyNote from './StickyNote'
import './ReflectionsGrouping.scss'

const ReflectionsGrouping = () => {
  const reflections = useSelector(state => state.allReflections)
  const zones = useSelector(state => state.retrospective.zones)

  return (
    <>
      <div>Grouping is not possible for the moment</div>
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
