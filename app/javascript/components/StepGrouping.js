import React from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import StickyNote from './StickyNote'
import Icon from './Icon'
import './StepGrouping.scss'

const StepGrouping = () => {
  const { kind } = useSelector(state => state.retrospective)
  const profile = useSelector(state => state.profile)
  const reflections = useSelector(state => state.visibleReflections, shallowEqual)
  const zones = useSelector(state => state.retrospective.zones, shallowEqual)
  const organizer = useSelector(state => state.profile.organizer)
  const reactions = useSelector(state => state.visibleReactions, shallowEqual)

  const visibilityObserver = React.useMemo(() => {
    const options = {
      root: document.querySelector('#zones-container'),
      rootMargin: '0px',
      threshold: 0
    }

    return new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        const target = entry.target
        let timeoutId = null

        if (entry.isIntersecting && entry.intersectionRatio > 0.2) {
          timeoutId = target.dataset.visibilityId
          if (timeoutId) return

          timeoutId = setTimeout(() => {
            console.log('An observed reflection was read')
            observer.unobserve(entry)
            clearTimeout(timeoutId)
            target.dataset.read = true
            target.dataset.visibilityId = null
          }, 2000)
          target.dataset.visibilityId = timeoutId
          console.log('An observed reflection entered the screen')
        } else {
          target.dataset.above = entry.boundingClientRect.top < entry.rootBounds.top
          target.dataset.below = entry.boundingClientRect.top > entry.rootBounds.top

          timeoutId = target.dataset.visibilityId
          if (!timeoutId) return

          console.log('An observed reflection left the screen')
          clearTimeout(timeoutId)
          target.dataset.visibilityId = null
        }
      })
    }, options)
  }, [])

  const [reflectionRefs, _setReflectionRefs] = React.useState(reflections.reduce((map, reflection) => {
    map[reflection.id] = React.createRef()
    return map
  }, {}))

  const scrollToStickyNote = (stickyNote) => {
    stickyNote.scrollIntoView()
  }

  const setStickyNoteRef = (stickyNote) => {
    if (!stickyNote) return

    if (stickyNote.dataset.ownerUuid === profile.uuid) {
      stickyNote.dataset.read = true
      return
    }

    const ref = reflectionRefs[stickyNote.dataset.id] || React.createRef()
    ref.current = stickyNote
    visibilityObserver.observe(stickyNote)
  }

  return (
    <>
      {organizer && <div>Click on a participant so that he can reveal his reflections</div>}
      {!organizer && <div>The organizer now chooses a participant so that he can reveal his reflections</div>}
      <div id='zones-container'>
        {zones.map((zone) => {
          const reflectionsInZone = reflections.filter((reflection) => reflection.zone.id === zone.id)
          const stickyNotesInZone = Object.entries(reflectionRefs).map(([_, stickyNoteRef]) => {
            return stickyNoteRef?.current?.dataset.zoneId == zone.id ? stickyNoteRef.current : null
          }).filter((stickyNote) => !!stickyNote)
          const unreadReflectionAbove = stickyNotesInZone.find((stickyNote) => !stickyNote.dataset.read !== 'true' && stickyNote.dataset.above === 'true')
          const unreadReflectionBelow = stickyNotesInZone.find((stickyNote) => !stickyNote.dataset.read !== 'true' && stickyNote.dataset.below === 'true')

          return (
            <div className='zone-column' key={zone.id}>
              <span className='zone-header'>{<Icon retrospectiveKind={kind} zone={zone.name} />}{zone.name}</span>
              <div className='scrolling-zone'>
                {reflectionsInZone.map((reflection) => {
                  const concernedReactions = reactions.filter((reaction) => reaction.targetId === `Reflection-${reflection.id}`)
                  const stickyNote = stickyNotesInZone.find((stickyNote) => stickyNote.dataset.id === reflection.id)
                  const isUnread = stickyNote && stickyNote.dataset.read !== 'true'
                  return <StickyNote key={reflection.id} ref={setStickyNoteRef} reflection={reflection} showReactions reactions={concernedReactions} glowing={isUnread} />
                })}
              </div>
              {!!unreadReflectionAbove && <div className='unread-notice above' onClick={() => scrollToStickyNote(unreadReflectionAbove)}>⬆︎ Unread reflection ⬆︎</div>}
              {!!unreadReflectionBelow && <div className='unread-notice below' onClick={() => scrollToStickyNote(unreadReflectionBelow)}>⬇︎ Unread reflection ⬇︎</div>}
            </div>
          )
        })}
      </div>
    </>
  )
}

export default StepGrouping
