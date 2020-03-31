import React from 'react'
import './Zone.scss'

const Zone = ({ reference, onClick, reflections, mode }) => {
  const { id, name } = reference
  const reflectionsCount = reflections.length
  const displayedReflectionsCount = reflectionsCount > 0 ? `(${reflectionsCount})` : ''

  return (
    <div id={id} onClick={onClick} className={`zone mode-${mode}`}>
      {name} {displayedReflectionsCount}
    </div>
  )
}

export default Zone
