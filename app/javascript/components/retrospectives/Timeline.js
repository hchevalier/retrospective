import React from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import PropTypes from 'prop-types'
import ZoomableArea from './ZoomableArea'
import Zone from './Zone'
import './Timeline.scss'

const Timeline = ({ highlightZones, onZoneClicked }) => {
  const reflections = useSelector(state => state.reflections.ownReflections, shallowEqual)
  const zones = useSelector(state => state.retrospective.zones, shallowEqual)

  return (
    <ZoomableArea>
      <>
        {zones.map((zone) => {
          return (
            <Zone
              key={zone.id}
              reference={zone}
              highlight={highlightZones}
              reflections={reflections.filter((reflection) => reflection.zone.id === zone.id)}
              onClick={onZoneClicked} />
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
