import React, { useState } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
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

const Avatar = ({ backgroundColor, dataAttributes, loggedIn, surname, self, onClick, children }) => {
  const [surnameVisible, setSurnameVisible] = useState(false)

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

  const handleMouseEnter = () => setSurnameVisible(true)
  const handleMouseLeave = () => setSurnameVisible(false)

  return (
    <div className='relative flex flex-row justify-center'>
      <div
        className={classNames('avatar cursor-pointer rounded w-12 h-12 relative mx-1', { self, clickable: !!onClick })}
        style={{ backgroundColor }}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...dataAttributes}>
        <img className='picture absolute' src={getDefaultContour()} />
        {children}
        <div className={classNames('status-indicator', { 'logged-in': loggedIn })} />
      </div>
      {surnameVisible && (
        <div className='bg-gray-800 text-white text-xs p-1 rounded-md absolute whitespace-no-wrap -bottom-8'>
          {surname}
        </div>
      )}
    </div>
  )
}

Avatar.propTypes = {
  backgroundColor: PropTypes.string.isRequired,
  dataAttributes: PropTypes.object,
  loggedIn: PropTypes.bool,
  surname: PropTypes.string.isRequired,
  self: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node
}

export default Avatar
