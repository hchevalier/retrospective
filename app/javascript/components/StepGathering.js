import React from 'react'
import { useSelector } from 'react-redux'
import ColorPicker from './ColorPicker'
import Card from './Card'

const StepGathering = () => {
  const retrospectiveId = useSelector(state => state.retrospective.id)

  return (
    <Card
      vertical
      className='pb-0 h-full'
      containerClassName='flex-1 px-4 h-full'>
      <span className='center text-xs'>Choose a color for your sticky notes</span>
      <ColorPicker retrospectiveId={retrospectiveId} />
    </Card>
  )
}

export default StepGathering
