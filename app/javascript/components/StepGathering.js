import React from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import AvatarEditor from './AvatarEditor'
import ColorPicker from './ColorPicker'
import Card from './Card'

const StepGathering = () => {
  const retrospectiveId = useSelector(state => state.retrospective.id)
  const profile = useSelector(state => state.profile, shallowEqual)

  return (
    <div className='flex flex-row h-full'>
      <div className='flex w-1/3 flex-col screen-limited overflow-y-hidden'>
        <Card
          vertical
          title='Sticky notes color'
          className='pb-0 h-full'
          containerClassName='flex-1 px-4 h-full'>
          <span className='center text-xs'>Choose a color for your sticky notes</span>
          <ColorPicker retrospectiveId={retrospectiveId} />
        </Card>
      </div>
      <div className='flex w-2/3 flex-col screen-limited overflow-y-hidden'>
        <Card
          vertical
          title='Avatar editor'
          className='pb-0 h-full'
          containerClassName='flex-1 px-4 h-full'>
          <AvatarEditor backgroundColor={profile.color} settings={profile.avatar} retrospectiveId={retrospectiveId} />
        </Card>
      </div>
    </div>
  )
}

export default StepGathering
