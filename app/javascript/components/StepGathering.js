import React from 'react'
import { useSelector } from 'react-redux'
import ColorPicker from './ColorPicker'

const StepGathering = () => {
  const retrospectiveId = useSelector(state => state.retrospective.id)

  return (
    <>
      <div className='text-blue-800 text-xs text-center'>Choose a color for your sticky notes</div>
      <ColorPicker retrospectiveId={retrospectiveId} />
    </>
  )
}

export default StepGathering
