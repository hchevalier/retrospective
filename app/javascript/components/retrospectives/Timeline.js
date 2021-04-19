import React from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import PropTypes from 'prop-types'
import { put } from 'lib/httpClient'
import StickyNote from '../StickyNote'
import ZoomableArea from './ZoomableArea'
import Zone from './Zone'
import './Timeline.scss'

const Timeline = ({ highlightZones, onZoneClicked }) => {
  const { id: retrospectiveId } = useSelector(state => state.retrospective)
  const reflections = useSelector(state => state.reflections.ownReflections, shallowEqual)
  const zones = useSelector(state => state.retrospective.zones, shallowEqual)
  const dispatch = useDispatch()

  const [draggingOccurs, setDraggingOccurs] = React.useState({ reflection: null, zone: null })

  const handleDragStart = (event) => {
    event.dataTransfer.setData('text/plain', event.target.dataset.id)
    event.dataTransfer.dropEffect = 'move'
    console.log('start')
    setDraggingOccurs({ reflection: event.target.dataset.id, zone: event.target.dataset.zoneId })
  }

  const handleDragOver = (event) => {
    console.log('over')
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }

  const handleDragEnd = () => {
    console.log('end')
    setDraggingOccurs({ reflection: null, zone: null })
  }

  const handleDrop = (event) => {
    console.log('drop')
    event.preventDefault()
    event.stopPropagation()

    const draggedReflectionId = event.dataTransfer.getData('text/plain')
    let targetElement = event.target
    console.log(targetElement)
    if (!targetElement) return

    if (targetElement.classList.contains('zone')) {
      moveReflection(targetElement.dataset.id, draggedReflectionId)
    }
  }

  const moveReflection = (zoneId, droppedReflectionId) => {
    put({
      url: `/retrospectives/${retrospectiveId}/reflections/${droppedReflectionId}`,
      payload: {
        zone_id: zoneId
      }
    })
      .then((updatedReflection) => dispatch({ type: 'change-reflection', reflection: updatedReflection }))
      .catch(error => console.warn(error))
  }

  return (
    <ZoomableArea>
      <>
        {zones.map((zone) => {
          const reflectionsInZone = reflections.filter((reflection) => reflection.zone.id === zone.id)
          return (
            <Zone
              key={zone.id}
              reference={zone}
              highlight={highlightZones || (draggingOccurs?.reflection && draggingOccurs.zone.id !== zone.id)}
              reflections={reflectionsInZone}
              onClick={onZoneClicked}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
              onDrop={handleDrop}>
              <div className='p-2'>
                {reflectionsInZone.length > 0 && (
                  <StickyNote
                    reflection={reflectionsInZone[0]}
                    readOnly
                    stack={reflectionsInZone}
                    draggable
                    onDragStart={handleDragStart} />
                )}
              </div>
            </Zone>
          )
        })}
      </>
    </ZoomableArea>
  )
}

Timeline.propTypes = {
  highlightZones: PropTypes.bool,
  onZoneClicked: PropTypes.func.isRequired
}

export default Timeline
