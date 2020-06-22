import React from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import { post, put } from 'lib/httpClient'
import Topic from './Topic'
import StickyNote from './StickyNote'
import Icon from './Icon'
import './StepGrouping.scss'

const inScreen = (target) => target.dataset.timeoutId && target.dataset.timeoutId !== 'null'
const noteAboveViewport = (stickyNote) => stickyNote.dataset.read !== 'true' && stickyNote.dataset.above === 'true' && !inScreen(stickyNote)
const noteBelowViewport = (stickyNote) => stickyNote.dataset.read !== 'true' && stickyNote.dataset.below === 'true' && !inScreen(stickyNote)

const StepGrouping = () => {
  const { id: retrospectiveId, kind } = useSelector(state => state.retrospective)
  const { uuid: profileUuid } = useSelector(state => state.profile)
  const reflections = useSelector(state => state.reflections.visibleReflections, shallowEqual)
  const zones = useSelector(state => state.retrospective.zones, shallowEqual)
  const organizer = useSelector(state => state.profile.organizer)
  const reactions = useSelector(state => state.reactions.visibleReactions, shallowEqual)

  const initialReflectionIds = React.useRef(reflections.map((reflection) => reflection.id)).current
  const [, setUpdateCount] = React.useState(0)
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

  const reflectionRefs = React.useRef(reflections.reduce((map, reflection) => {
    map[reflection.id] = React.createRef()
    return map
  }, {})).current

  const scrollToStickyNote = (stickyNote) => {
    stickyNote.scrollIntoView({ behavior: 'smooth' })
  }

  const setStickyNoteRef = (stickyNote) => {
    if (!stickyNote) return

    if (stickyNote.dataset.ownerUuid === profileUuid || initialReflectionIds.indexOf(stickyNote.dataset.id) >= 0) {
      stickyNote.dataset.read = true
      return
    }

    const ref = reflectionRefs[stickyNote.dataset.id] || React.createRef()
    ref.current = stickyNote
    reflectionRefs[stickyNote.dataset.id] = ref
    visibilityObserver.observe(stickyNote)
  }

  const handleDragStart = (event) => {
    event.dataTransfer.setData('text/plain', event.target.dataset.id)
    event.dataTransfer.dropEffect = 'move'
  }

  const handleDragOver = (event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (event) => {
    event.preventDefault()
    const draggedReflectionId = event.dataTransfer.getData('text/plain')
    let targetElement = event.target
    const droppedReflection = document.querySelector(`.reflection[data-id="${draggedReflectionId}"]`)

    if (!targetElement.classList.contains('reflection') && !targetElement.classList.contains('topic')) {
      targetElement = targetElement.closest('.reflection') || targetElement.closest('topic')
    }

    if (!targetElement) return

    if (targetElement.closest('.zone-column') !== droppedReflection.closest('.zone-column')) return

    if (targetElement.classList.contains('topic')) {
      updateTopic(targetElement.dataset.id, draggedReflectionId)
    } else if (targetElement.classList.contains('reflection')) {
      const parent = targetElement.parentNode
      if (parent.classList.contains('scrolling-zone')) {
        createTopic(targetElement.dataset.id, draggedReflectionId)
      } else if (parent.classList.contains('topic')) {
        updateTopic(parent.dataset.id, draggedReflectionId)
      }
    }
  }

  const createTopic = (targetReflectionId, droppedReflectionId) => {
    post({
      url: `/retrospectives/${retrospectiveId}/topics`,
      payload: {
        target_reflection_id: targetReflectionId,
        dropped_reflection_id: droppedReflectionId
      }
    })
      .catch(error => console.warn(error))
  }

  const updateTopic = (topicId, droppedReflectionId) => {
    put({
      url: `/retrospectives/${retrospectiveId}/topics/${topicId}`,
      payload: {
        reflection_id: droppedReflectionId
      }
    })
      .catch(error => console.warn(error))
  }

  const renderTopic = (reflection, reflectionsInZone, stickyNotesInZone) => {
    const reflectionsInTopic = reflectionsInZone.filter((otherReflection) => otherReflection.topic?.id === reflection.topic.id)
    const reflectionIds = reflectionsInTopic.map((otherReflection) => otherReflection.id)
    const stickyNotesInTopic = stickyNotesInZone.filter((stickyNote) => reflectionIds.includes(stickyNote.dataset.id))
    const reactionsInTopic = reactions.filter((reaction) => reflectionIds.includes(reaction.targetId.split(/-(.+)?/, 2)[1]))

    return <Topic
      key={reflection.topic.id}
      topic={reflection.topic}
      reflections={reflectionsInTopic}
      reactions={reactionsInTopic}
      showReactions
      stickyNotesRefCallback={setStickyNoteRef}
      stickyNotes={stickyNotesInTopic || []}
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop} />
  }

  return (
    <>
      {organizer && <div>Click on a participant so that he can reveal his reflections or randomly pick one</div>}
      {!organizer && <div>The organizer now chooses a participant so that he can reveal his reflections</div>}
      <div id="zones-container" className="flex">
        {zones.map((zone) => {
          const reflectionsInZone = reflections.filter((reflection) => reflection.zone.id === zone.id)
          const stickyNotesInZone = Object.entries(reflectionRefs).map(([, stickyNoteRef]) => {
            return stickyNoteRef?.current?.dataset.zoneId == zone.id ? stickyNoteRef.current : null
          }).filter((stickyNote) => !!stickyNote)
          const unreadReflectionAbove = stickyNotesInZone.find(noteAboveViewport)
          const unreadReflectionBelow = stickyNotesInZone.reverse().find(noteBelowViewport)

          const topics = {}

          return (
            <div className='zone-column border flex-1 m-2 p-4 rounded first:ml-0 last:mr-0' key={zone.id}>
              <div className='zone-header mb-4'>{<Icon retrospectiveKind={kind} zone={zone.name} />}{zone.name}</div>
              {!!unreadReflectionAbove && <div className='unread-notice above' onClick={() => scrollToStickyNote(unreadReflectionAbove)}>⬆︎ Unread reflection ⬆︎</div>}
              <div className='scrolling-zone flex flex-col'>
                {reflectionsInZone.map((reflection) => {
                  if (reflection.topic?.id && !topics[reflection.topic?.id]) {
                    topics[reflection.topic?.id] = reflection.topic
                    return renderTopic(reflection, reflectionsInZone, stickyNotesInZone)
                  } else if (!reflection.topic?.id) {
                    const concernedReactions = reactions.filter((reaction) => reaction.targetId === `Reflection-${reflection.id}`)
                    const stickyNote = stickyNotesInZone.find((stickyNote) => stickyNote.dataset.id === reflection.id)
                    const isUnread = stickyNote && stickyNote.dataset.read !== 'true'

                    return <StickyNote
                      key={reflection.id}
                      ref={setStickyNoteRef}
                      reflection={reflection}
                      showReactions
                      reactions={concernedReactions}
                      glowing={isUnread}
                      draggable
                      onDragStart={handleDragStart}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop} />
                  }
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
