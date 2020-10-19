import React from 'react'
import { useSelector } from 'react-redux'
import ColorPicker from './ColorPicker'

const StepGathering = () => {
  const retrospectiveId = useSelector(state => state.retrospective.id)

  return (
    <>
      <span className='center text-xs'>Choose a color for your sticky notes</span>
      <ColorPicker retrospectiveId={retrospectiveId} />
    </>
  )
}

export default StepGathering
