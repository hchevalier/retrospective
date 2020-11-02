import React from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import AvatarEditor from './AvatarEditor'
import ColorPicker from './ColorPicker'
import Card from './Card'

const StepGathering = () => {
  const retrospectiveId = useSelector(state => state.retrospective.id)
  const profile = useSelector(state => state.profile, shallowEqual)

  return (
    <Card
      vertical
      className='pb-0 h-full'
      containerClassName='flex-1 px-4 h-full'>
      <span className='center text-xs'>Choose a color for your sticky notes</span>
      <ColorPicker retrospectiveId={retrospectiveId} />

      <AvatarEditor backgroundColor={profile.color} settings={profile.avatar} retrospectiveId={retrospectiveId} />
    </Card>
  )
}

export default StepGathering
