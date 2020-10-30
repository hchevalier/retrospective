import React, { useState } from 'react'
import PropTypes from 'prop-types'
import './TooltipToggler.scss'

const TooltipToggler = ({ content, position = 'top' }) => {
  const [visible, setVisible] = useState(false)

  const handleMouseEnter = () => setVisible(true)
  const handleMouseLeave = () => setVisible(false)

  const positionalStyle = {}
  if (position === 'left') {
    positionalStyle.right = '-10px'
    positionalStyle.left = 'auto'
  }

  return (
    <>
      <span onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className='text-center'>
        <span className='inline-block relative'>
          <span className='inline-block w-4 rounded-full bg-gray-800 text-white text-xs'>?</span>
          {visible && (
            <>
              <div className='tooltip-arrow border-8 border-solid border-transparent absolute' style={{ top: '10px' }}></div>
              <div className='absolute my-2 mx-1 w-64 -left-32 mt-0 z-20' style={{ top: '25px', ...positionalStyle }}>
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
  content: PropTypes.string.isRequired,
  position: PropTypes.string
}

export default TooltipToggler
