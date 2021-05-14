import React from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Zone from './Zone'
import Icon from '../Icon'
import './Daki.scss'

const Daki = ({ highlightZones, onZoneClicked }) => {
  const reflections = useSelector(state => state.reflections.ownReflections, shallowEqual)
  const zones = useSelector(state => state.retrospective.zones, shallowEqual)

  const drop = zones.find((zone) => zone.name === 'Drop')
  const add = zones.find((zone) => zone.name === 'Add')
  const keep = zones.find((zone) => zone.name === 'Keep')
  const idea = zones.find((zone) => zone.name === 'Idea')

  return (
    <div id='daki_wrapper' className='flex flex-col divide-y w-1/2 mt-12'>
      <div className='flex flex-row flex-1 divide-x'>
        <div id='drop' className={classNames('flex-1 text-center pt-20', { 'highlight': highlightZones })} data-id={drop.id} onClick={onZoneClicked}>
          <Zone
            reference={drop}
            icon={<Icon retrospectiveKind='daki' zone='Drop' dataAttributes={{ 'data-id': drop.id }} onClick={onZoneClicked} />}
            reflections={reflections.filter((reflection) => reflection.zone.id === drop.id)}
            onClick={onZoneClicked} />
        </div>
        <div id='add' className={classNames('flex-1 text-center pt-20', { 'highlight': highlightZones })} data-id={add.id} onClick={onZoneClicked}>
          <Zone
            reference={add}
            icon={<Icon retrospectiveKind='daki' zone='Add' dataAttributes={{ 'data-id': add.id }} onClick={onZoneClicked} />}
            reflections={reflections.filter((reflection) => reflection.zone.id === add.id)}
            onClick={onZoneClicked} />
        </div>
      </div>
      <div className='flex flex-row flex-1 divide-x'>
        <div id='keep' className={classNames('flex-1 text-center pt-20', { 'highlight': highlightZones })} data-id={keep.id} onClick={onZoneClicked}>
          <Zone
            reference={keep}
            icon={<Icon retrospectiveKind='daki' zone='Keep' dataAttributes={{ 'data-id': keep.id }} onClick={onZoneClicked} />}
            reflections={reflections.filter((reflection) => reflection.zone.id === keep.id)}
            onClick={onZoneClicked} />
        </div>
        <div id='idea' className={classNames('flex-1 text-center pt-20', { 'highlight': highlightZones })} data-id={idea.id} onClick={onZoneClicked}>
          <Zone
            reference={idea}
            icon={<Icon retrospectiveKind='daki' zone='Idea' dataAttributes={{ 'data-id': idea.id }} onClick={onZoneClicked} />}
            reflections={reflections.filter((reflection) => reflection.zone.id === idea.id)}
            onClick={onZoneClicked} />
        </div>
      </div>
    </div>
  )
}

Daki.propTypes = {
  highlightZones: PropTypes.bool,
  onZoneClicked: PropTypes.func.isRequired
}

export default Daki
