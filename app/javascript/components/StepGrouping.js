import React from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import PropTypes from 'prop-types'
import { post, put } from 'lib/httpClient'
import Topic from './Topic'
import StickyNote from './StickyNote'
import TooltipToggler from './TooltipToggler'
import Icon from './Icon'
import { groupBy } from 'lib/helpers/array'
import SingleChoice from './SingleChoice'
import './StepGrouping.scss'

const inScreen = (target) => target.dataset.timeoutId && target.dataset.timeoutId !== 'null'
const noteAboveViewport = (stickyNote) => stickyNote.dataset.read !== 'true' && stickyNote.getBoundingClientRect().top < stickyNote.dataset.rootTop && !inScreen(stickyNote)
const noteBelowViewport = (stickyNote) => stickyNote.dataset.read !== 'true' && stickyNote.getBoundingClientRect().top > stickyNote.dataset.rootTop && !inScreen(stickyNote)

const StepGrouping = ({ onExpandTopic }) => {
  const { id: retrospectiveId, kind } = useSelector(state => state.retrospective)
  const { uuid: profileUuid } = useSelector(state => state.profile)
  const reflections = useSelector(state => state.reflections.visibleReflections, shallowEqual)
  const zones = useSelector(state => state.retrospective.zones, shallowEqual)
  const facilitator = useSelector(state => state.profile.facilitator)
  const reactions = useSelector(state => state.reactions.visibleReactions, shallowEqual)
  const zonesTypology = useSelector(state => state.retrospective.zonesTypology)

  const initialReflectionIds = React.useRef(reflections.map((reflection) => reflection.id)).current
  const [, setUpdateCount] = React.useState(0)
  const [columnWidth, setColumnWidth] = React.useState('auto')
  const [draggingOccurs, setDraggingOccurs] = React.useState({ reflection: null, zone: null })
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
          target.dataset.rootTop = entry.rootBounds.top
          if (target.dataset.timeoutId) {
            clearTimeout(target.dataset.timeoutId)
            target.dataset.timeoutId = null
          }
          forceUpdate()
        }
      })
    }, options)
  }, [])

  const sizeObserver = new ResizeObserver((entries) => entries.some((entry) => {
    setColumnWidth(entry.target.closest('.zone-column')?.offsetWidth || 'auto')
    return true
  }))

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
      if (justRevealedOwnReflection(stickyNote)) scrollToStickyNote(stickyNote)
      stickyNote.dataset.read = true
      return
    }

    const ref = reflectionRefs[stickyNote.dataset.id] || React.createRef()
    ref.current = stickyNote
    reflectionRefs[stickyNote.dataset.id] = ref
    visibilityObserver.observe(stickyNote)
    sizeObserver.observe(stickyNote)
  }

  const justRevealedOwnReflection = (stickyNote) => {
    return stickyNote.dataset.ownerUuid === profileUuid &&
      initialReflectionIds.indexOf(stickyNote.dataset.id) === -1 &&
      !stickyNote.dataset.read
  }

  const handleDragStart = (event) => {
    event.dataTransfer.setData('text/plain', event.target.dataset.id)
    event.dataTransfer.dropEffect = 'move'
    setDraggingOccurs({ reflection: event.target.dataset.id, zone: event.target.dataset.zoneId })
  }

  const handleDragOver = (event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }

  const handleDragEnd = () => {
    setDraggingOccurs({ reflection: null, zone: null })
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
      onClick={onExpandTopic}
      draggingInfo={draggingOccurs}
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDrop={handleDrop} />
  }

  const tooltipContent = (
    <>
      {facilitator && <div>Click on a participant (or the random icon) so that he or she can reveal their reflections</div>}
      {!facilitator && <div>The facilitator now chooses a participant so that he or she can reveal their reflections</div>}
      <div>Everyone can drag a reflection and drop it on another one in order to stack them into a group</div>
    </>
  )

  return (
    <>
      <div className='text-center text-xs text-gray-800'><TooltipToggler content={tooltipContent} /> Hover the question mark to display instructions for this step</div>

      <div id="zones-container" className="flex w-full h-full overflow-x-scroll">
        {zones.map((zone) => {
          const reflectionsInZone = reflections.filter((reflection) => reflection.zone.id === zone.id)
          const stickyNotesInZone = Object.entries(reflectionRefs).map(([, stickyNoteRef]) => {
            return stickyNoteRef?.current?.dataset.zoneId == zone.id ? stickyNoteRef.current : null
          }).filter((stickyNote) => !!stickyNote)
          const unreadReflectionAbove = stickyNotesInZone.find(noteAboveViewport)
          const unreadReflectionBelow = stickyNotesInZone.reverse().find(noteBelowViewport)

          const topics = {}
          let reflectionsByValue = {}
          if (zonesTypology === 'single_choice') {
            reflectionsByValue = groupBy(reflectionsInZone, 'content')
          }

          return (
            <div className='zone-column border flex-1 m-2 p-4 rounded first:ml-0 last:mr-0 relative min-w-12' key={zone.id}>
              <div className='zone-header mb-4'>{<Icon retrospectiveKind={kind} zone={zone.name} />}{zone.name}</div>
              {['open', 'limited'].includes(zonesTypology) && (
                <>
                  {!!unreadReflectionAbove && <div className='unread-notice above' style={{ width: columnWidth }} onClick={() => scrollToStickyNote(unreadReflectionAbove)}>⬆︎ Unread reflection ⬆︎</div>}
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
                          highlighted={draggingOccurs.zone === zone.id.toString() && draggingOccurs.reflection !== reflection.id.toString()}
                          draggable
                          onDragStart={handleDragStart}
                          onDragOver={handleDragOver}
                          onDragEnd={handleDragEnd}
                          onDrop={handleDrop} />
                      }
                    })}
                  </div>
                  {!!unreadReflectionBelow && <div className='unread-notice below' style={{ width: columnWidth }} onClick={() => scrollToStickyNote(unreadReflectionBelow)}>⬇︎ Unread reflection ⬇︎</div>}
                </>
              )}
              {zonesTypology === 'single_choice' && (
                <>
                  {Object.keys(reflectionsByValue).map((key) => <SingleChoice key={key} selected value={key} badge={reflectionsByValue[key].length} />)}
                </>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}

StepGrouping.propTypes = {
  onExpandTopic: PropTypes.func
}

export default StepGrouping
