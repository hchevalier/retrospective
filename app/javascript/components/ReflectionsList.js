import React from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import classNames from 'classnames'
import { groupBy } from 'lib/helpers/array'
import StickyNote from './StickyNote'
import Button from './Button'
import Icon from './Icon'
import ArrowIcon from 'images/arrow-icon.svg'

const ReflectionsList = ({ open, retrospectiveKind, onToggle, onDone }) => {
  const revealer = useSelector(state => state.profile.revealer)
  const currentStep = useSelector(state => state.orchestrator.step)
  const reflections = useSelector(state => state.reflections.ownReflections, shallowEqual)
  const zones = useSelector(state => state.retrospective.zones, shallowEqual)
  const channel = useSelector(state => state.orchestrator.subscription)

  const handleRevealClick = (event) => {
    const reflectionUuid = event.currentTarget.dataset.id
    channel.reveal(reflectionUuid)
  }

  const shouldDisplayReveal = React.useCallback(() => revealer && currentStep === 'grouping', [revealer, currentStep])

  const unrevealed = reflections.filter((reflection) => !reflection.revealed).length

  React.useEffect(() => {
    if (revealer && unrevealed === 0) {
      onDone()
    }
  }, [unrevealed])

  const reflectionsByZone = groupBy(reflections, 'zone.id')

  return (
    <>
      <div id='reflections-pannel' className='bg-gray-200 mr-4 relative -left-4 -mt-6 p-4 shadow-right flex'>
        {!revealer && (
          <div className='justify-start items-start px-2 w-10'>
            <img className={classNames('cursor-pointer duration-200 ease-in-out transition-transform transform rotate-90', { '-rotate-90': open })} src={ArrowIcon} width="24" onClick={onToggle} />
          </div>
        )}
        <div className={classNames('transition-width duration-500 ease-in-out w-0 h-full overflow-x-hidden', { 'w-64': open })}>
          <div className='font-bold min-w-16'>
            My reflections
          </div>
          {zones.map((zone) => {
            const reflectionsInZone = reflectionsByZone[zone.id] || []
            return (
              <div key={zone.id} className='p-2 border-t min-w-16'>
                <div>
                  <Icon retrospectiveKind={retrospectiveKind} zone={zone.name} /> {zone.name}
                </div>
                {reflectionsInZone.filter((reflection) => !reflection.revealed).map((reflection) => (
                  <div key={reflection.id}>
                    <StickyNote reflection={reflection} readOnly={currentStep !== 'thinking'} />
                    {shouldDisplayReveal() &&
                      <Button
                        secondary
                        disabled={reflection.revealed}
                        data-id={reflection.id}
                        onClick={handleRevealClick}>
                        {reflection.revealed ? 'Revealed' : 'Reveal'}
                      </Button>
                    }
                  </div>
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
