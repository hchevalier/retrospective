import React from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Zone from './Zone'
import Icon from '../Icon'
import './PlusMinusInteresting.scss'

const PlusMinusInteresting = ({ highlightZones, onZoneClicked }) => {
  const reflections = useSelector(state => state.reflections.ownReflections, shallowEqual)
  const zones = useSelector(state => state.retrospective.zones, shallowEqual)

  const plus = zones.find((zone) => zone.name === 'Plus')
  const minus = zones.find((zone) => zone.name === 'Minus')
  const interesting = zones.find((zone) => zone.name === 'Interesting')

  return (
    <div className='circle-outer'>
      <ul className='circle'>
        <li>
          <Zone
            reference={interesting}
            icon={<Icon retrospectiveKind='pmi' zone='Interesting' dataAttributes={{ 'data-id': interesting.id }} onClick={onZoneClicked} />}
            reflections={reflections.filter((reflection) => reflection.zone.id === interesting.id)}
            onClick={onZoneClicked} />
          <div className={classNames('background', { 'highlight': highlightZones })} data-id={interesting.id} onClick={onZoneClicked}></div>
        </li>
        <li>
          <Zone
            reference={plus}
            icon={<Icon retrospectiveKind='pmi' zone='Plus' dataAttributes={{ 'data-id': plus.id }} onClick={onZoneClicked} />}
            reflections={reflections.filter((reflection) => reflection.zone.id === plus.id)}
            onClick={onZoneClicked} />
          <div className={classNames('background', { 'highlight': highlightZones })} data-id={plus.id} onClick={onZoneClicked}></div>
        </li>
        <li>
          <Zone
            reference={minus}
            icon={<Icon retrospectiveKind='pmi' zone='Minus' dataAttributes={{ 'data-id': minus.id }} onClick={onZoneClicked} />}
            reflections={reflections.filter((reflection) => reflection.zone.id === minus.id)}
            onClick={onZoneClicked} />
          <div className={classNames('background', { 'highlight': highlightZones })} data-id={minus.id} onClick={onZoneClicked}></div>
        </li>
      </ul>
    </div>
  )
}

PlusMinusInteresting.propTypes = {
  highlightZones: PropTypes.bool,
  onZoneClicked: PropTypes.func.isRequired
}

export default PlusMinusInteresting
