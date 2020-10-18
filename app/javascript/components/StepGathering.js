import React from 'react'
import { useSelector } from 'react-redux'
import Card from './Card'
import ColorPicker from './ColorPicker'

const StepGathering = () => {
  const retrospectiveId = useSelector(state => state.retrospective.id)

  return (
    <Card title='Choose a color for your sticky notes' center>
      <ColorPicker retrospectiveId={retrospectiveId} />
    </Card>
  )
}

export default StepGathering
