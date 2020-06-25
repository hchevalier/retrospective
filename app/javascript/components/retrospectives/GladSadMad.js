import React from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Zone from './Zone'
import Icon from '../Icon'
import './GladSadMad.scss'

const GladSadMad = ({ highlightZones, onZoneClicked }) => {
  const reflections = useSelector(state => state.reflections.ownReflections, shallowEqual)
  const zones = useSelector(state => state.retrospective.zones, shallowEqual)

  const glad = zones.find((zone) => zone.name === 'Glad')
  const sad = zones.find((zone) => zone.name === 'Sad')
  const mad = zones.find((zone) => zone.name === 'Mad')

  return (
    <div className='circle-outer'>
      <ul className='circle'>
        <li>
          <Zone
            reference={glad}
            icon={<Icon retrospectiveKind='glad_sad_mad' zone='Glad' dataAttributes={{ 'data-id': glad.id }} onClick={onZoneClicked} />}
            reflections={reflections.filter((reflection) => reflection.zone.id === glad.id)}
            onClick={onZoneClicked} />
          <div className={classNames('background', { 'highlight': highlightZones })} data-id={glad.id} onClick={onZoneClicked}></div>
        </li>
        <li>
          <Zone
            reference={sad}
            icon={<Icon retrospectiveKind='glad_sad_mad' zone='Sad' dataAttributes={{ 'data-id': sad.id }} onClick={onZoneClicked} />}
            reflections={reflections.filter((reflection) => reflection.zone.id === sad.id)}
            onClick={onZoneClicked} />
          <div className={classNames('background', { 'highlight': highlightZones })} data-id={sad.id} onClick={onZoneClicked}></div>
        </li>
        <li>
          <Zone
            reference={mad}
            icon={<Icon retrospectiveKind='glad_sad_mad' zone='Mad' dataAttributes={{ 'data-id': mad.id }} onClick={onZoneClicked} />}
            reflections={reflections.filter((reflection) => reflection.zone.id === mad.id)}
            onClick={onZoneClicked} />
          <div className={classNames('background', { 'highlight': highlightZones })} data-id={mad.id} onClick={onZoneClicked}></div>
        </li>
      </ul>
    </div>
  )
}

GladSadMad.propTypes = {
  highlightZones: PropTypes.bool,
  onZoneClicked: PropTypes.func.isRequired
}

export default GladSadMad
