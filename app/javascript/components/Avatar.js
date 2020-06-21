import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import LightBulbIcon from 'images/lightbulb-icon.svg'
import SpeechBubbleIcon from 'images/speech-bubble-icon.svg'
import Man1 from 'images/avatars/men/1.svg'
import Man2 from 'images/avatars/men/2.svg'
import Man3 from 'images/avatars/men/3.svg'
import Man4 from 'images/avatars/men/4.svg'
import Man5 from 'images/avatars/men/5.svg'
import Man6 from 'images/avatars/men/6.svg'
import Woman1 from 'images/avatars/women/1.svg'
import Woman2 from 'images/avatars/women/2.svg'
import Woman3 from 'images/avatars/women/3.svg'
import Woman4 from 'images/avatars/women/4.svg'
import Woman5 from 'images/avatars/women/5.svg'
import Woman6 from 'images/avatars/women/6.svg'
import './Avatar.scss'

const DEFAULT_AVATARS = {
  men: [Man1, Man2, Man3, Man4, Man5, Man6],
  women: [Woman1, Woman2, Woman3, Woman4, Woman5, Woman6]
}

const Avatar = ({ backgroundColor, flags, loggedIn, surname, self, onClick, overlay }) => {
  const getDefaultContour = () => {
    let firstLetterValue = surname[0].toUpperCase().charCodeAt(0) - 65
    if (firstLetterValue < 0 || firstLetterValue > 25) firstLetterValue = 25

    let avatarIndex = Math.floor(firstLetterValue / 4)
    if (avatarIndex > 5) avatarIndex = 5

    // This rule is not base on facts nor statistics, this is an arbitrary choice to get to a dumb result
    if (surname[surname.length - 1] === 'e') {
      return DEFAULT_AVATARS.women[avatarIndex]
    }

    return DEFAULT_AVATARS.men[avatarIndex]
  }

  return (
    <div className={classNames('avatar rounded mx-1', { self })} style={{ backgroundColor }} onClick={onClick}>
      <img className='picture' src={getDefaultContour()} />
      {flags.organizer && <img className='flex-row absolute left-0' src={LightBulbIcon} width='20' />}
      {flags.revealer && <img className='flex-row absolute right-0' src={SpeechBubbleIcon} width='16' />}
      {overlay && <div className='overlay'>{overlay}</div>}
      <div className='surname text-xs'>{surname}</div>
      <div className={classNames('status-indicator', { 'logged-in': loggedIn })} />
    </div>
  )
}

Avatar.propTypes = {
  backgroundColor: PropTypes.string.isRequired,
  flags: PropTypes.shape({
    organizer: PropTypes.bool,
    revealer: PropTypes.bool
  }),
  loggedIn: PropTypes.bool,
  surname: PropTypes.string.isRequired,
  self: PropTypes.bool,
  onClick: PropTypes.func,
  overlay: PropTypes.node
}

export default Avatar
