import React from 'react'
import Glad from 'images/glad.png'
import Sad from 'images/sad.png'
import Mad from 'images/mad.png'
import Keep from 'images/keep.png'
import Start from 'images/start.png'
import Stop from 'images/stop.png'
import More from 'images/more.png'
import Less from 'images/less.png'
import './Icon.scss'

const iconFor = (retrospectiveKind, zone) => {
  switch (`${retrospectiveKind}-${zone}`) {
    case 'glad_sad_mad-Glad':
      return Glad
    case 'glad_sad_mad-Sad':
      return Sad
    case 'glad_sad_mad-Mad':
      return Mad
    case 'starfish-Keep':
      return Keep
    case 'starfish-Start':
      return Start
    case 'starfish-Stop':
      return Stop
    case 'starfish-More':
      return More
    case 'starfish-Less':
      return Less
  }

  return null
}

const Icon = ({ retrospectiveKind, zone }) => {
  let icon = iconFor(retrospectiveKind, zone)

  if (!icon) {
    return null
  }

  return <img className='zone-icon' src={icon} />
}

export default Icon
