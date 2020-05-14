import React from 'react'
import PropTypes from 'prop-types'
import './Zone.scss'

const Zone = ({ reference, icon, onClick, reflections, mode }) => {
  const { id, name } = reference
  const reflectionsCount = reflections.length
  const displayedReflectionsCount = reflectionsCount > 0 ? `(${reflectionsCount})` : ''

  return (
    <div id={id} data-id={id} onClick={onClick} className={`zone mode-${mode}`}>
      {icon} {name} {displayedReflectionsCount}
    </div>
  )
}

Zone.propTypes = {
  reference: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  }),
  icon: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  reflections: PropTypes.array.isRequired,
  mode: PropTypes.string.isRequired
}


export default Zone
