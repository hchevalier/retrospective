import React, { useState } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import Avataaar from 'avataaars'
import './Avatar.scss'

const Avatar = ({ backgroundColor, dataAttributes, loggedIn, surname, settings, self, onClick, children }) => {
  const [surnameVisible, setSurnameVisible] = useState(false)

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
        <div className='picture absolute'>
          <Avataaar
            style={{ width: '48px', height: '48px' }}
            avatarStyle='Transparent'
            {...settings} />
          </div>
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
