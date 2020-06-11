import React from 'react'
import classNames from 'classnames'

const Button = ({ children, primary, secondary, contained, ...rest }) => {
  return (
    <button
      type='button'
      {...rest}
      className={classNames(
        'font-medium rounded focus:outline-none focus:shadow-outline',
        {
          'text-white py-1 px-2': (primary || secondary) && contained,
          'bg-blue-500 hover:bg-blue-700 ': primary && contained,
          'bg-red-500 hover:bg-red-700 ': secondary && contained,
          'text-sm text-blue-600': primary && !contained,
          'text-sm text-red-600': secondary && !contained,
        })}
    >
      {children}
    </button >
  )
}

Button.defaultProps = {
  secondary: false
}

export default Button
