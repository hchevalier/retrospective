import React from 'react'
import classNames from 'classnames'
import './StickyBookmark.scss'

const StickyBookmark = ({ color, children, otherClassNames = {} }) => {
  return (
    <div className={classNames('sticky-bookmark', otherClassNames)} style={{ backgroundColor: color }}>
      {children}
    </div>
  )
}

export default StickyBookmark
