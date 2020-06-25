import React from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import classNames from 'classnames'
import { groupBy } from 'lib/helpers/array'
import StickyNote from './StickyNote'
import Icon from './Icon'
import ArrowIcon from 'images/arrow-icon-black.svg'
import './ReflectionsList.scss'

const ReflectionsList = ({ open, retrospectiveKind, onToggle, onDone }) => {
  const revealer = useSelector(state => state.profile.revealer)
  const currentStep = useSelector(state => state.orchestrator.step)
  const reflections = useSelector(state => state.reflections.ownReflections, shallowEqual)
  const zones = useSelector(state => state.retrospective.zones, shallowEqual)

  const unrevealed = reflections.filter((reflection) => !reflection.revealed).length

  React.useEffect(() => {
    if (revealer && unrevealed === 0) {
      onDone()
    }
  }, [unrevealed])

  const reflectionsByZone = groupBy(reflections, 'zone.id')

  return (
    <>
      <div id='reflections-pannel' className='bg-gray-200 relative p-4 shadow-right flex flex-row'>
        <div className='justify-start items-start px-2 w-10'>
          <img className={classNames('cursor-pointer duration-200 ease-in-out transition-transform transform rotate-90', { '-rotate-90': open, 'invisible': revealer })} src={ArrowIcon} width="24" onClick={onToggle} />
        </div>
        <div id='reflections-container' className={classNames('transition-width duration-500 ease-in-out w-0 overflow-x-hidden', { 'w-64': open })}>
          <div className='flex min-w-16 flex-rows justify-between pb-2'>
            <div className='font-bold'>My reflections</div>
            {revealer && <button className='bg-blue-400 focus:outline-none focus:shadow-outline font-medium hover:bg-blue-600 rounded text-white cursor-pointer p-1' onClick={onDone}>I'm done</button>}
          </div>
          {zones.map((zone) => {
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
        </div>
      </div>
    </>
  )
}

export default ReflectionsList
