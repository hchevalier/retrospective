import React from 'react'
import './Zone.scss'

const Zone = ({ reference, icon, onClick, reflections, mode }) => {
  const { id, name } = reference
  const reflectionsCount = reflections.length
  const displayedReflectionsCount = reflectionsCount > 0 ? `(${reflectionsCount})` : ''

  return (
    <div id={id} onClick={onClick} className={`zone mode-${mode}`}>
      <img src={icon} width={'24px'} height={'24px'}></img>
      {name} {displayedReflectionsCount}
    </div>
  )
}

export default Zone
