import React, { useState, useEffect, useRef, useCallback } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import './ZoomableArea.scss'

const ZoomableArea = ({ children }) => {
  const MIN_ZOOM = -30
  const MAX_ZOOM = 20
  const MOUSE_WHEEL_STEP = 2

  const [zoomLevel, setZoomLevel] = useState(0)

  const innerRef = useRef(null)

  const zoomLevelClasses = {
    'zoom-3': zoomLevel === -30,
    'zoom-2': zoomLevel > -30 && zoomLevel <= -20,
    'zoom-1': zoomLevel > -20 && zoomLevel <= -10,
    'zoom1': zoomLevel >= 10 && zoomLevel < 20,
    'zoom2': zoomLevel === 20,
  }

  const canZoomOut = zoomLevel > MIN_ZOOM
  const canZoomIn = zoomLevel < MAX_ZOOM

  const handleZoomOut = useCallback((_event, step = 10) => {
    if (canZoomOut) setZoomLevel(Math.max(MIN_ZOOM, zoomLevel - step))
  }, [canZoomOut, zoomLevel, setZoomLevel, MIN_ZOOM])

  const handleZoomIn = useCallback((_event, step = 10) => {
    if (canZoomIn) setZoomLevel(Math.min(zoomLevel + step, MAX_ZOOM))
  }, [canZoomIn, zoomLevel, setZoomLevel, MAX_ZOOM])

  useEffect(() => {
    const handleMouseWheel = (event) => {
      event.stopPropagation()

      if (event.wheelDelta > 100) {
        event.preventDefault()
        handleZoomIn(null, MOUSE_WHEEL_STEP)
      } else if (event.wheelDelta < -100) {
        event.preventDefault()
        handleZoomOut(null, MOUSE_WHEEL_STEP)
      }
    }

    const container = innerRef.current
    container.addEventListener('wheel', handleMouseWheel, { passive: false })
    return () => { container.removeEventListener('wheel', handleMouseWheel) }
  }, [handleZoomIn, handleZoomOut])

  return (
    <>
      <div className='absolute top-0 right-0 mr-2 mt-2 z-10'>
        <div className={classNames('rounded-t-lg bg-gray-200 px-2 border cursor-pointer select-none', { 'cursor-not-allowed text-gray-700': !canZoomOut} )} onClick={handleZoomOut}>-</div>
        <div className={classNames('rounded-b-lg bg-gray-200 px-2 border cursor-pointer select-none', { 'cursor-not-allowed text-gray-700': !canZoomIn} )} onClick={handleZoomIn}>+</div>
      </div>
      <div id='retrospective-container' ref={innerRef} className={classNames('relative', zoomLevelClasses)}>
        {children}
      </div>
    </>
  )
}

export default ZoomableArea
