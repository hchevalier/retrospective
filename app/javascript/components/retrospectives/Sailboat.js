import React from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import PropTypes from 'prop-types'
import Zone from './Zone'
import './Sailboat.scss'
import WindBackground from 'images/wind.png'
import AnchorBackground from 'images/anchor.png'
import RocksBackground from 'images/rocks.png'
import IslandBackground from 'images/island.png'
import SailboatImage from 'images/sailboat.png'
import CloudImage from 'images/cloud.png'

const Sailboat = ({ mode, onZoneClicked }) => {
  const reflections = useSelector(state => state.reflections.ownReflections, shallowEqual)
  const zones = useSelector(state => state.retrospective.zones, shallowEqual)

  const wind = zones.find((zone) => zone.name === 'Wind')
  const anchor = zones.find((zone) => zone.name === 'Anchor')
  const rocks = zones.find((zone) => zone.name === 'Rocks')
  const island = zones.find((zone) => zone.name === 'Island')

  return (
    <div style={{ position: 'relative', height: '500px' }}>
      <img id='img-sailboat' src={SailboatImage} height='320' />
      <img id='img-cloud' src={CloudImage} width='200' style={{ position: 'absolute', left: 0, zIndex: 1 }} />

      <Zone
        reference={wind}
        mode={mode}
        background={WindBackground}
        reflections={reflections.filter((reflection) => reflection.zone.id === wind.id)}
        htmlStyle={{ position: 'absolute', width: '160px', height: '90px', top: '60px', left: '200px' }}
        onClick={onZoneClicked} />
      <Zone
        reference={anchor}
        mode={mode}
        background={AnchorBackground}
        reflections={reflections.filter((reflection) => reflection.zone.id === anchor.id)}
        htmlStyle={{ position: 'absolute', width: '260px', height: '200px', top: '270px', left: '190px' }}
        onClick={onZoneClicked} />
      <Zone
        reference={rocks}
        mode={mode}
        background={RocksBackground}
        reflections={reflections.filter((reflection) => reflection.zone.id === rocks.id)}
        htmlStyle={{ position: 'absolute', width: '250px', height: '160px', top: '220px', right: '340px' }}
        onClick={onZoneClicked} />
      <Zone
        reference={island}
        mode={mode}
        background={IslandBackground}
        reflections={reflections.filter((reflection) => reflection.zone.id === island.id)}
        htmlStyle={{ position: 'absolute', width: '320px', height: '270px', top: '50px', right: 0 }}
        onClick={onZoneClicked} />
    </div>
  )
}

Sailboat.propTypes = {
  mode: PropTypes.string.isRequired,
  onZoneClicked: PropTypes.func.isRequired
}

export default Sailboat
