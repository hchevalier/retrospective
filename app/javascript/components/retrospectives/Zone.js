import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './Zone.scss'

const Zone = ({ background, height, icon, mode, onClick, reference, reflections, width }) => {
  const { id, name } = reference
  const reflectionsCount = reflections.length
  const displayedReflectionsCount = reflectionsCount > 0 ? `(${reflectionsCount})` : ''

  const inlineStyle = icon ? {} : {
    backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundPosition: 'center', width, height
  }

  return (
    <div id={`zone-${name}`} data-id={id} onClick={onClick} className={`zone mode-${mode}`} style={inlineStyle}>
      <div className={classNames('zone-label', { 'absolute-zone-label': !icon})} data-id={id}>
        {icon ? icon : null} {name} {displayedReflectionsCount}
      </div>
    </div>
  )
}

Zone.propTypes = {
  background: PropTypes.node,
  height: PropTypes.number,
  icon: PropTypes.node,
  mode: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  reference: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  }),
  reflections: PropTypes.array.isRequired,
  width: PropTypes.number
}

export default Zone
