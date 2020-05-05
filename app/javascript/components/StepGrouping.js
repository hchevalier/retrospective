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
        if (entry.isIntersecting && entry.intersectionRatio > 0.2) {
          let timeoutId = entry.dataset.visibilityId
          if (timeoutId) return

          timeoutId = setTimeout(() => {
            observer.unobserve(entry)
            clearTimeout(timeoutId)
            entry.dataset.read = true
            entry.dataset.timeoutId = null
          }, 2000)
          entry.dataset.visibilityId = timeoutId
        } else {
          timeoutId = entry.dataset.visibilityId
          if (!timeoutId) return

          clearTimeout(timeoutId)
          entry.dataset.timeoutId = null
          entry.dataset.read = false
          // TODO set entry.dataset.above if entry is above
          // TODO set entry.dataset.below if entry is below
        }
      })
    }, options)
  }, [])

  const reflectionRefs = React.useState(reflections.reduce((map, reflection) => {
    map[reflection.id] = React.createRef()
    return map
  }, {}))

  const scrollToStickyNote = (reflectionId) => {
    reflectionRefs[reflectionId].current.scrollIntoView()
  }

  const setStickyNoteRef = (stickyNote) => {
    if (!stickyNote) return

    if (stickyNote.props.reflection.owner.uuid === profile.uuid) {
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
            return stickyNoteRef.props.reflection.zone.id === zone.id ? stickyNoteRef.current : null
          })
          const unreadReflectionAbove = !!stickyNotesInZone.find((stickyNote) => stickyNote.dataset.above === true)
          const unreadReflectionBelow = !!stickyNotesInZone.find((stickyNote) => stickyNote.dataset.below === true)

          return (
            <div className='zone-column' key={zone.id}>
              <span className='zone-header'>{<Icon retrospectiveKind={kind} zone={zone.name} />}{zone.name}</span>
              <div className='scrolling-zone'>
                {reflectionsInZone.map((reflection) => {
                  const concernedReactions = reactions.filter((reaction) => reaction.targetId === `Reflection-${reflection.id}`)
                  const isUnread = !!stickyNotesInZone.find((reflectionId) => reflectionId === reflection.id)
                  return <StickyNote key={reflection.id} ref={setStickyNoteRef} reflection={reflection} showReactions reactions={concernedReactions} glowing={isUnread} />
                })}
              </div>
              {unreadReflectionAbove && <div className='unread-notice above' onClick={() => scrollToStickyNote(stickyNotesInZone[0])}>⬆︎ Unread reflection ⬆︎</div>}
              {unreadReflectionBelow && <div className='unread-notice below' onClick={() => scrollToStickyNote(stickyNotesInZone[0])}>⬇︎ Unread reflection ⬇︎</div>}
            </div>
          )
        })}
      </div>
    </>
  )
}

export default StepGrouping
