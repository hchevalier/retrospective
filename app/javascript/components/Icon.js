import React from 'react'
import PropTypes from 'prop-types'
import Glad from 'images/glad.png'
import Sad from 'images/sad.png'
import Mad from 'images/mad.png'
import Plus from 'images/plus.png'
import Minus from 'images/minus.png'
import Interesting from 'images/interesting.png'
import Liked from 'images/liked.png'
import Learned from 'images/learned.png'
import Lacked from 'images/lacked.png'
import LongedFor from 'images/longed_for.png'
import Keep from 'images/keep.png'
import Start from 'images/start.png'
import Stop from 'images/stop.png'
import More from 'images/more.png'
import Less from 'images/less.png'
import Wind from 'images/wind.png'
import Anchor from 'images/anchor.png'
import Rocks from 'images/rocks.png'
import Island from 'images/island.png'
import './Icon.scss'
import Drop from 'images/drop.png'
import Add from 'images/add.png'
import KeepIt from 'images/keepit.png'
import Idea from 'images/idea.png'

const iconFor = (retrospectiveKind, zone) => {
  switch (`${retrospectiveKind}-${zone}`) {
    case 'glad_sad_mad-Glad':
      return Glad
    case 'glad_sad_mad-Sad':
      return Sad
    case 'glad_sad_mad-Mad':
      return Mad
    case 'pmi-Plus':
      return Plus
    case 'pmi-Minus':
      return Minus
    case 'pmi-Interesting':
      return Interesting
    case 'four_l-Liked':
      return Liked
    case 'four_l-Learned':
      return Learned
    case 'four_l-Lacked':
      return Lacked
    case 'four_l-Longed for':
      return LongedFor
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
    case 'sailboat-Wind':
      return Wind
    case 'sailboat-Anchor':
      return Anchor
    case 'sailboat-Rocks':
      return Rocks
    case 'sailboat-Island':
      return Island
    case 'daki-Drop':
      return Drop
    case 'daki-Add':
      return Add
    case 'daki-Keep':
      return KeepIt
    case 'daki-Idea':
      return Idea
  }

  return null
}

const Icon = ({ retrospectiveKind, zone, onClick, dataAttributes }) => {
  let icon = iconFor(retrospectiveKind, zone)

  if (!icon) {
    return null
  }

  return <img className='zone-icon' src={icon} onClick={onClick} {...dataAttributes} />
}

Icon.propTypes = {
  retrospectiveKind: PropTypes.string.isRequired,
  zone: PropTypes.string.isRequired,
  dataAttributes: PropTypes.object,
  onClick: PropTypes.func
}

Icon.defaultProps = {
  dataAttributes: {}
}

export default Icon
