import React from 'react'

const Zone = ({ reference, onClick, reflections }) => {
  const { name } = reference
  const size = () => reflections.length

  return (
    <div id={name} onClick={onClick}>
      {name}
    </div>
  )
}

export default Zone
