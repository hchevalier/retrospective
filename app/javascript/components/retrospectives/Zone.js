import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './Zone.scss'

const Zone = ({ background, hideCount, height, highlight, icon, onClick, reference, reflections, width, children }) => {
  const { id, name } = reference
  const reflectionsCount = reflections.length
  const displayedReflectionsCount = reflectionsCount > 0 && !hideCount ? `(${reflectionsCount})` : ''

  const inlineStyle = icon ? {} : {
    backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundPosition: 'center', width, height
  }

  return (
    <div id={`zone-${name}`} data-id={id} onClick={onClick} className={classNames('zone', { highlight })} style={inlineStyle}>
      <div className={classNames('zone-label', { 'absolute-zone-label': !icon})} data-id={id}>
        {icon ? icon : null} {name} {displayedReflectionsCount}
      </div>
      {children}
    </div>
  )
}

Zone.propTypes = {
  background: PropTypes.node,
  height: PropTypes.number,
  hideCount: PropTypes.bool,
  highlight: PropTypes.bool,
  icon: PropTypes.node,
  onClick: PropTypes.func.isRequired,
  reference: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  }),
  reflections: PropTypes.array.isRequired,
  width: PropTypes.number
}

export default Zone
