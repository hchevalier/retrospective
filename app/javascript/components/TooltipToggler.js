import React, { useState } from 'react'
import PropTypes from 'prop-types'
import './TooltipToggler.scss'

const TooltipToggler = ({ content }) => {
  const [visible, setVisible] = useState(false)

  const handleMouseEnter = () => setVisible(true)
  const handleMouseLeave = () => setVisible(false)

  return (
    <>
      <span onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <span className='inline-block relative'>
          <span className='inline-block w-4 rounded-full bg-gray-800 text-white text-xs'>?</span>
          {visible && (
            <>
              <div className='tooltip-arrow border-8 border-solid border-transparent relative -top-2'></div>
              <div className='absolute my-2 mx-1 w-64 -left-32 mt-0 top-8'>
                <div className='bg-gray-800 text-white text-xs p-1 rounded-md' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                  {content}
                </div>
              </div>
            </>
          )}
        </span>
      </span>
    </>
  )
}


TooltipToggler.propTypes = {
  content: PropTypes.string.isRequired
}

export default TooltipToggler
