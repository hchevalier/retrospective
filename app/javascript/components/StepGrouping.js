import React from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import StickyNote from './StickyNote'
import Icon from './Icon'
import './StepGrouping.scss'

const inScreen = (target) => target.dataset.timeoutId && target.dataset.timeoutId !== 'null'
const noteAboveViewport = (stickyNote) => stickyNote.dataset.read !== 'true' && stickyNote.dataset.above === 'true' && !inScreen(stickyNote)
const noteBelowViewport = (stickyNote) => stickyNote.dataset.read !== 'true' && stickyNote.dataset.below === 'true' && !inScreen(stickyNote)

const StepGrouping = () => {
  const { kind } = useSelector(state => state.retrospective)
  const profile = useSelector(state => state.profile)
  const reflections = useSelector(state => state.visibleReflections, shallowEqual)
  const zones = useSelector(state => state.retrospective.zones, shallowEqual)
  const organizer = useSelector(state => state.profile.organizer)
  const reactions = useSelector(state => state.visibleReactions, shallowEqual)

  const [initialReflectionIds, _setInitialReflectionIds] = React.useState(reflections.map((reflection) => reflection.id))
  const [_updateCount, setUpdateCount] = React.useState(0)
  const forceUpdate = () => setUpdateCount(currentCount => ++currentCount)

  const visibilityObserver = React.useMemo(() => {
    const options = {
      rootMargin: '0px',
      threshold: 0.25
    }

    return new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        const target = entry.target

        if (entry.isIntersecting && entry.intersectionRatio > 0) {
          if (inScreen(target)) return

          const timeoutId = setTimeout(() => {
            observer.unobserve(target)
            clearTimeout(timeoutId)
            target.dataset.read = true
            forceUpdate()
          }, 1500)
          target.dataset.timeoutId = timeoutId
          forceUpdate()
        } else {
          target.dataset.above = entry.boundingClientRect.top < entry.rootBounds.top
          target.dataset.below = entry.boundingClientRect.top > entry.rootBounds.top
          if (target.dataset.timeoutId) {
            clearTimeout(target.dataset.timeoutId)
            target.dataset.timeoutId = null
          }
          forceUpdate()
        }
      })
    }, options)
  }, [])

  const [reflectionRefs, _setReflectionRefs] = React.useState(reflections.reduce((map, reflection) => {
    map[reflection.id] = React.createRef()
    return map
  }, {}))

  const scrollToStickyNote = (stickyNote) => {
    stickyNote.scrollIntoView({ behavior: 'smooth' })
  }

  const setStickyNoteRef = (stickyNote) => {
    if (!stickyNote) return

    if (stickyNote.dataset.ownerUuid === profile.uuid || initialReflectionIds.indexOf(stickyNote.dataset.id) >= 0) {
      stickyNote.dataset.read = true
      return
    }

    const ref = reflectionRefs[stickyNote.dataset.id] || React.createRef()
    ref.current = stickyNote
    reflectionRefs[stickyNote.dataset.id] = ref
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
          const unreadReflectionAbove = stickyNotesInZone.find(noteAboveViewport)
          const unreadReflectionBelow = stickyNotesInZone.reverse().find(noteBelowViewport)

          return (
            <div className='zone-column' key={zone.id}>
              <span className='zone-header'>{<Icon retrospectiveKind={kind} zone={zone.name} />}{zone.name}</span>
              {!!unreadReflectionAbove && <div className='unread-notice above' onClick={() => scrollToStickyNote(unreadReflectionAbove)}>⬆︎ Unread reflection ⬆︎</div>}
              <div className='scrolling-zone'>
                {reflectionsInZone.map((reflection) => {
                  const concernedReactions = reactions.filter((reaction) => reaction.targetId === `Reflection-${reflection.id}`)
                  const stickyNote = stickyNotesInZone.find((stickyNote) => stickyNote.dataset.id === reflection.id)
                  const isUnread = stickyNote && stickyNote.dataset.read !== 'true'
                  return <StickyNote key={reflection.id} ref={setStickyNoteRef} reflection={reflection} showReactions reactions={concernedReactions} glowing={isUnread} />
                })}
              </div>
              {!!unreadReflectionBelow && <div className='unread-notice below' onClick={() => scrollToStickyNote(unreadReflectionBelow)}>⬇︎ Unread reflection ⬇︎</div>}
            </div>
          )
        })}
      </div>
    </>
  )
}

export default StepGrouping
