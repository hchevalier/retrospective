import React from 'react'
import PropTypes from 'prop-types'
import './Zone.scss'

const Zone = ({ background, height, htmlStyle, icon, mode, onClick, reference, reflections, width }) => {
  const { id, name } = reference
  const reflectionsCount = reflections.length
  const displayedReflectionsCount = reflectionsCount > 0 ? `(${reflectionsCount})` : ''

  if (icon) {
    return (<div id={id} onClick={onClick} className={`zone mode-${mode}`} style={htmlStyle}>
      {icon} {name} {displayedReflectionsCount}
    </div>)
  }

  return (
    <div id={id} onClick={onClick} className={`zone mode-${mode}`} style={{ backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundPosition: 'center', width, height, ...htmlStyle }}>
      {name} {displayedReflectionsCount}
    </div>
  )
}

Zone.propTypes = {
  background: PropTypes.node,
  height: PropTypes.number,
  htmlStyle: PropTypes.object,
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

Zone.defaultProps = {
  htmlStyle: {}
}

export default Zone
