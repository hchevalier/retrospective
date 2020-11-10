import React from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Zone from './Zone'
import Icon from '../Icon'
import './FourL.scss'

const FourL = ({ highlightZones, onZoneClicked }) => {
  const reflections = useSelector(state => state.reflections.ownReflections, shallowEqual)
  const zones = useSelector(state => state.retrospective.zones, shallowEqual)

  const liked = zones.find((zone) => zone.name === 'Liked')
  const learned = zones.find((zone) => zone.name === 'Learned')
  const lacked = zones.find((zone) => zone.name === 'Lacked')
  const longedFor = zones.find((zone) => zone.name === 'Longed for')

  return (
    <div id='four_l_wrapper' className='flex flex-col divide-y w-1/2 mt-12'>
      <div className='flex flex-row flex-1 divide-x'>
        <div id='liked' className={classNames('flex-1 text-center pt-20', { 'highlight': highlightZones })} data-id={liked.id} onClick={onZoneClicked}>
          <Zone
            reference={liked}
            icon={<Icon retrospectiveKind='four_l' zone='Liked' dataAttributes={{ 'data-id': liked.id }} onClick={onZoneClicked} />}
            reflections={reflections.filter((reflection) => reflection.zone.id === liked.id)}
            onClick={onZoneClicked} />
        </div>
        <div id='learned' className={classNames('flex-1 text-center pt-20', { 'highlight': highlightZones })} data-id={learned.id} onClick={onZoneClicked}>
          <Zone
            reference={learned}
            icon={<Icon retrospectiveKind='four_l' zone='Learned' dataAttributes={{ 'data-id': learned.id }} onClick={onZoneClicked} />}
            reflections={reflections.filter((reflection) => reflection.zone.id === learned.id)}
            onClick={onZoneClicked} />
        </div>
      </div>
      <div className='flex flex-row flex-1 divide-x'>
        <div id='lacked' className={classNames('flex-1 text-center pt-20', { 'highlight': highlightZones })} data-id={lacked.id} onClick={onZoneClicked}>
          <Zone
            reference={lacked}
            icon={<Icon retrospectiveKind='four_l' zone='Lacked' dataAttributes={{ 'data-id': lacked.id }} onClick={onZoneClicked} />}
            reflections={reflections.filter((reflection) => reflection.zone.id === lacked.id)}
            onClick={onZoneClicked} />
        </div>
        <div id='longed-for' className={classNames('flex-1 text-center pt-20', { 'highlight': highlightZones })} data-id={longedFor.id} onClick={onZoneClicked}>
          <Zone
            reference={longedFor}
            icon={<Icon retrospectiveKind='four_l' zone='Longed for' dataAttributes={{ 'data-id': longedFor.id }} onClick={onZoneClicked} />}
            reflections={reflections.filter((reflection) => reflection.zone.id === longedFor.id)}
            onClick={onZoneClicked} />
        </div>
      </div>
    </div>
  )
}

FourL.propTypes = {
  highlightZones: PropTypes.bool,
  onZoneClicked: PropTypes.func.isRequired
}

export default FourL
