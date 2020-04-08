import React from 'react'
import './StickyNote.scss'

const StickyNote = ({ reflection }) => {
  return (
    <div className='reflection'>
      <div className='reflection-content-container'>
        <div className='author'>{reflection.owner.surname}</div>
        <div className='content'>{reflection.content}</div>
      </div>
    </div>
  )
}

export default StickyNote
