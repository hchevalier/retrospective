import React, { useState } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import './ZoomableArea.scss'

const ZoomableArea = ({ children }) => {
  const MIN_ZOOM = -3
  const MAX_ZOOM = 2

  const [zoomLevel, setZoomLevel] = useState(0)

  const zoomLevelClasses = {
    'zoom-3': zoomLevel === -3,
    'zoom-2': zoomLevel === -2,
    'zoom-1': zoomLevel === -1,
    'zoom1': zoomLevel === 1,
    'zoom2': zoomLevel === 2,
  }

  const canZoomOut = zoomLevel > MIN_ZOOM
  const canZoomIn = zoomLevel < MAX_ZOOM

  const handleZoomOut = () => {
    if (canZoomOut) setZoomLevel(zoomLevel - 1)
  }

  const handleZoomIn = () => {
    if (canZoomIn) setZoomLevel(zoomLevel + 1)
  }

  const handleMouseWheel = (event) => {
    event.stopPropagation()

    if (event.nativeEvent.wheelDelta > 100) {
      handleZoomIn()
    } else if (event.nativeEvent.wheelDelta < -100) {
      handleZoomOut()
    }
  }

  return (
    <>
      <div className='absolute top-0 right-0 mr-2 mt-2 z-10'>
        <div className={classNames('rounded-t-lg bg-gray-200 px-2 border cursor-pointer', { 'cursor-not-allowed text-gray-700': !canZoomOut} )} onClick={handleZoomOut}>-</div>
        <div className={classNames('rounded-b-lg bg-gray-200 px-2 border cursor-pointer', { 'cursor-not-allowed text-gray-700': !canZoomIn} )} onClick={handleZoomIn}>+</div>
      </div>
      <div id='retrospective-container' className={classNames('relative', zoomLevelClasses)} onWheel={handleMouseWheel}>
        {children}
      </div>
    </>
  )
}

export default ZoomableArea
