import React from 'react'
import PropTypes from 'prop-types'
import Glad from 'images/glad.png'
import Sad from 'images/sad.png'
import Mad from 'images/mad.png'
import './Icon.scss'

const iconFor = (retrospectiveKind, zone) => {
  switch (`${retrospectiveKind}-${zone}`) {
    case 'glad_sad_mad-Glad':
      return Glad
    case 'glad_sad_mad-Sad':
      return Sad
    case 'glad_sad_mad-Mad':
      return Mad
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
