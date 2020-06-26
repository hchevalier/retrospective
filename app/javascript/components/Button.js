import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

const Button = ({ children, contained, disabled, onClick, primary, secondary, ...rest }) => {
  const handleClick = (event) => {
    if (!disabled && onClick) onClick(event)
  }

  return (
    <button
      type='button'
      onClick={handleClick}
      {...rest}
      className={classNames(
        'font-medium rounded focus:outline-none focus:shadow-outline',
        {
          'text-white py-1 px-2': (primary || secondary) && contained,
          'bg-blue-500 hover:bg-blue-700': primary && contained,
          'bg-red-500 hover:bg-red-700': secondary && contained,
          'text-sm text-blue-600': primary && !contained,
          'text-sm text-red-600': secondary && !contained,
          'opacity-50 cursor-not-allowed': disabled
        })}
    >
      {children}
    </button >
  )
}

Button.defaultProps = {
  secondary: false
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  contained: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  primary: PropTypes.bool,
  secondary: PropTypes.bool
}

export default Button
