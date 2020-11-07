import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import './StickyBookmark.scss'

const StickyBookmark = ({ color, children, onClick, otherClassNames = {} }) => {
  return (
    <div className={classNames('sticky-bookmark', otherClassNames)} style={{ backgroundColor: color }} onClick={onClick}>
      {children}
    </div>
  )
}

StickyBookmark.propTypes = {
  color: PropTypes.string.isRequired,
  children: PropTypes.node,
  onClick: PropTypes.func,
  otherClassNames: PropTypes.oneOfType([PropTypes.shape, PropTypes.string])
}

export default StickyBookmark
