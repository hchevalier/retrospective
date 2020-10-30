import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './SingleChoice.scss'

const SingleChoice = ({ badge, collapsed, onClick, selected, value, zone }) => {
  const count = collapsed ? 1 : badge

  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          data-id={`zone-${zone}`}
          data-value={value}
          className={classNames('m-1 choice text-center border border-gray-500', { [value]: true, selected: selected })}
          onClick={onClick}>
            {collapsed && badge}
        </div>
      ))}
    </>
  )
}

SingleChoice.propTypes = {
  badge: PropTypes.number,
  collapsed: PropTypes.bool,
  onClick: PropTypes.func,
  selected: PropTypes.bool,
  value: PropTypes.string.isRequired,
  zone: PropTypes.string
}

export default SingleChoice
