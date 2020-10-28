import React from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import classNames from 'classnames'
import { post } from 'lib/httpClient'
import { groupBy } from 'lib/helpers/array'
import Card from './Card'
import StickyNote from './StickyNote'
import SingleChoice from './SingleChoice'
import Icon from './Icon'
import EyeIcon from 'images/eye-icon.svg'
import './ReflectionsList.scss'

const ReflectionsList = ({ retrospectiveKind, onDone }) => {
  const { revealer, stepDone } = useSelector(state => state.profile)
  const channel = useSelector(state => state.orchestrator.subscription)
  const currentStep = useSelector(state => state.orchestrator.step)
  const reflections = useSelector(state => state.reflections.ownReflections, shallowEqual)
  const zones = useSelector(state => state.retrospective.zones, shallowEqual)
  const zonesTypology = useSelector(state => state.retrospective.zonesTypology)

  const [thinkingDone, setThinkingDone] = React.useState(stepDone)

  const unrevealed = reflections.filter((reflection) => !reflection.revealed).length

  const handleReveal = (reflection) => {
    channel.reveal(reflection.id)
  }

  React.useEffect(() => {
    if (revealer && unrevealed === 0) {
      onDone()
    }
  }, [unrevealed])

  const reflectionsByZone = groupBy(reflections, 'zone.id')

  const handleDone = () => {
    if (currentStep === 'thinking') {
      return post({ url: `/api/notices`, payload: { message: 'toggle_step_done' } }).then(() => setThinkingDone(!thinkingDone))
    }

    onDone()
  }

  let actionAvailable = null
  if (currentStep === 'thinking' || revealer) {
    actionAvailable = thinkingDone && !revealer ? 'I forgot something' : "I'm done"
  }

  return (
    <>
      <div id='reflections-panel' className={classNames('bg-transparent relative py-4 flex flex-row h-full', { infinite: currentStep !== 'thinking' })}>
        <Card title='My reflections' actionLabel={actionAvailable} actionLocation='header' onAction={handleDone} vertical wrapperClassName='screen-limited fixed top-18'>
          <div id='reflections-container'>
            {['open', 'limited'].includes(zonesTypology) && zones.map((zone, index) => {
              const reflectionsInZone = reflectionsByZone[zone.id] || []
              return (
                <div key={zone.id} className={classNames('p-2 w-64', { 'border-t': index > 0 })}>
                  <div className='mb-2'>
                    <Icon retrospectiveKind={retrospectiveKind} zone={zone.name} /> {zone.name}
                  </div>
                  {reflectionsInZone.filter((reflection) => !reflection.revealed).map((reflection) => (
                    <StickyNote key={reflection.id} reflection={reflection} readOnly={currentStep !== 'thinking'} revealable />
                  ))}
                </div>
              )
            })}
            {zonesTypology === 'single_choice' && zones.map((zone, index) => {
              const reflectionsInZone = reflectionsByZone[zone.id] || []
              const unrevealedReflection = reflectionsInZone.filter((reflection) => !reflection.revealed)[0]

              return (
                <div key={zone.id} className={classNames('p-2 w-64', { 'border-t': index > 0 })}>
                  <div className='mb-2 font-semibold'>{zone.name}</div>
                  <div className='text-xs'>{zone.hint}</div>
                  {unrevealedReflection && (
                    <>
                      <SingleChoice selected badge={1} value={unrevealedReflection.content} />
                      {revealer && <img src={EyeIcon} className='eye-icon inline cursor-pointer' onClick={() => handleReveal(unrevealedReflection)} width='24px' />}
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </>
  )
}

export default ReflectionsList
