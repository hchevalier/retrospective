import React from 'react'
import classNames from 'classnames'
import './StickyBookmark.scss'

const StickyBookmark = ({ color, children, onClick, otherClassNames = {} }) => {
  return (
    <div className={classNames('sticky-bookmark', otherClassNames)} style={{ backgroundColor: color }} onClick={onClick}>
      {children}
    </div>
  )
}

export default StickyBookmark
