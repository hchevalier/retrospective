import React from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import classNames from 'classnames'
import { post } from 'lib/httpClient'
import { groupBy } from 'lib/helpers/array'
import StickyNote from './StickyNote'
import SingleChoice from './SingleChoice'
import Icon from './Icon'
import ArrowIcon from 'images/arrow-icon-black.svg'
import EyeIcon from 'images/eye-icon.svg'
import './ReflectionsList.scss'

const ReflectionsList = ({ open, retrospectiveKind, onToggle, onDone }) => {
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

  return (
    <>
      <div id='reflections-panel' className={classNames('bg-gray-200 relative p-4 shadow-right flex flex-row', { infinite: currentStep !== 'thinking' })}>
        <div className='justify-start items-start px-2 w-10'>
          <img className={classNames('cursor-pointer duration-200 ease-in-out transition-transform transform rotate-90', { '-rotate-90': open, 'invisible': revealer })} src={ArrowIcon} width="24" onClick={onToggle} />
        </div>
        <div id='reflections-container' className={classNames('transition-width duration-500 ease-in-out w-0 overflow-x-hidden', { 'w-64': open })}>
          <div className='flex min-w-16 flex-rows justify-between pb-2'>
            <div className='font-bold'>My reflections</div>
            {(currentStep === 'thinking' || revealer) &&
              <button className='bg-blue-400 focus:outline-none focus:shadow-outline font-medium hover:bg-blue-600 rounded text-white cursor-pointer p-1 text-xs' onClick={handleDone}>
                {thinkingDone && !revealer ? 'I forgot something' : "I'm done"}
              </button>
            }
          </div>
          {['open', 'limited'].includes(zonesTypology) && zones.map((zone) => {
            const reflectionsInZone = reflectionsByZone[zone.id] || []
            return (
              <div key={zone.id} className='p-2 border-t min-w-16'>
                <div className='mb-2'>
                  <Icon retrospectiveKind={retrospectiveKind} zone={zone.name} /> {zone.name}
                </div>
                {reflectionsInZone.filter((reflection) => !reflection.revealed).map((reflection) => (
                  <StickyNote key={reflection.id} reflection={reflection} readOnly={currentStep !== 'thinking'} revealable />
                ))}
              </div>
            )
          })}
          {zonesTypology === 'single_choice' && zones.map((zone) => {
            const reflectionsInZone = reflectionsByZone[zone.id] || []
            const unrevealedReflection = reflectionsInZone.filter((reflection) => !reflection.revealed)[0]

            return (
              <div key={zone.id} className='p-2 border-t min-w-16'>
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
      </div>
    </>
  )
}

export default ReflectionsList
