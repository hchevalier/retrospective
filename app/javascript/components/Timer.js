import React from 'react'
import './Timer.scss'

const Timer = () => {
  return (
    <div id='timer'>
      Timer: <span>10</span><span className='colon-separator'>:</span><span>00</span>
    </div>
  )
}

export default Timer
