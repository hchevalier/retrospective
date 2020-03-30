import React from 'react'
import GladSadMad from './retrospectives/GladSadMad'
import RetrospectiveBottomBar from './RetrospectiveBottomBar'

const AvatarPicker = () => {
  return (
    <div>
      You can choose an avatar here:
    </div>
  )
}

const RetrospectiveArea = ({ profile, channels, currentStep, retrospectiveId, kind, zones, initialOwnReflections, onZoneClicked }) => {
  const [reflections, setReflections] = React.useState([...initialOwnReflections])

  const addNewReflection = React.useCallback((newReflection) => setReflections(prevReflections => [...prevReflections, newReflection]))

  // TODO: return retrospective depending on kind
  // TODO: Handle remaining states: grouping, voting, actions, done
  return (
    <>
      {currentStep === 'gathering' && <AvatarPicker />}
      {currentStep === 'thinking' && <GladSadMad reflections={reflections} zones={zones} onZoneClicked={onZoneClicked} />}
      <RetrospectiveBottomBar profile={profile} channels={channels} onReflectionCreation={addNewReflection} />
    </>
  )
}

export default RetrospectiveArea
