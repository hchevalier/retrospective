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

  const [columnsWithUnreadReflections, setColumnsWithUnreadReflections] = React.useState({})
  const [visibleReflections, setVisibleReflections] = React.useState([])

  const setUnreadReflection = (reflection) => {
    const alreadyTracked = columnsWithUnreadReflections[reflection.zone.id] || []
    setColumnsWithUnreadReflections({ ...columnsWithUnreadReflections, [reflection.zone.id]: [...alreadyTracked, reflection.id] })
  }

  const handleScroll = () => {
    Object.entries(columnsWithUnreadReflections).map(([column, reflectionsFromColumn]) => {
      reflectionsFromColumn.map((reflectionId) => {
        const visible = isReflectionVisible(reflectionId)
        if (visible && !visibleReflections.find((visibleReflectionId) => visibleReflectionId === reflectionId)) {
          setVisibleReflections([...visibleReflections, reflectionId])

          setTimeout(() => {
            if (isReflectionVisible(reflectionId)) {
              const filteredReflections = (columnsWithUnreadReflections[column] || []).filter((trackedReflectionId) => trackedReflectionId !== reflectionId)
              setColumnsWithUnreadReflections({ ...columnsWithUnreadReflections, [column]: filteredReflections })
            }
            setVisibleReflections(visibleReflections.filter((visibleReflectionId) => visibleReflectionId !== reflectionId))
          }, 2000)
        } else if (!visible) {
          setVisibleReflections(visibleReflections.filter((visibleReflectionId) => visibleReflectionId !== reflectionId))
        }
      })
    })
  }

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [columnsWithUnreadReflections])

  const firstRender = React.useRef(true)
  const visibleReflectionRefs = React.useRef(visibleReflections.reduce((map, reflection) => {
    map[reflection.id] = React.createRef()
    return map
  }, {}))

  const scrollToUnread = (reflectionId) => {
    visibleReflectionRefs.current[reflectionId].current.scrollIntoView()
  }

  const isReflectionVisible = (reflectionId, mode = 'visible', threshold = 20) => {
    const element = visibleReflectionRefs.current[reflectionId]?.current
    if (!element) return false

    const rect = element.getBoundingClientRect()
    const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight)
    const isAbove = rect.bottom - threshold < 0
    const isBelow = rect.top - viewHeight + threshold >= 0

    return mode === 'above' ? isAbove : (mode === 'below' ? isBelow : !isAbove && !isBelow)
  }

  React.useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }

    const latestReflection = reflections[reflections.length - 1]
    if (!latestReflection) return

    visibleReflectionRefs.current[latestReflection.id] = React.createRef()

    setTimeout(() => {
      if (!isReflectionVisible(latestReflection.id) && latestReflection.owner.uuid !== profile.uuid) {
        setUnreadReflection(latestReflection)
      }
    }, 500)
  }, [reflections])

  const setStickyNoteRef = (stickyNote) => {
    if (!stickyNote) return

    const ref = visibleReflectionRefs.current[stickyNote.dataset.id] || React.createRef()
    ref.current = stickyNote
    visibleReflectionRefs.current[stickyNote.dataset.id] = ref
  }

  return (
    <>
      {organizer && <div>Click on a participant so that he can reveal his reflections</div>}
      {!organizer && <div>The organizer now chooses a participant so that he can reveal his reflections</div>}
      <div id='zones-container'>
        {zones.map((zone) => {
          const unreadFromColumn = columnsWithUnreadReflections[zone.id] || []
          const unreadReflectionAbove = !!unreadFromColumn.find((reflectionId) => isReflectionVisible(reflectionId, 'above'))
          const unreadReflectionBelow = !!unreadFromColumn.find((reflectionId) => isReflectionVisible(reflectionId, 'below'))

          return (
            <div className='zone-column' key={zone.id}>
              <span className='zone-header'>{<Icon retrospectiveKind={kind} zone={zone.name} />}{zone.name}</span>
              <div className='scrolling-zone'>
                {reflections.filter((reflection) => reflection.zone.id === zone.id).map((reflection) => {
                  const concernedReactions = reactions.filter((reaction) => reaction.targetId === `Reflection-${reflection.id}`)
                  const isUnread = !!unreadFromColumn.find((reflectionId) => reflectionId === reflection.id)
                  return <StickyNote key={reflection.id} ref={setStickyNoteRef} reflection={reflection} showReactions reactions={concernedReactions} glowing={isUnread} />
                })}
              </div>
              {unreadReflectionAbove && <div className='unread-notice above' onClick={() => scrollToUnread(unreadFromColumn[0])}>⬆︎ Unread reflection ⬆︎</div>}
              {unreadReflectionBelow && <div className='unread-notice below' onClick={() => scrollToUnread(unreadFromColumn[0])}>⬇︎ Unread reflection ⬇︎</div>}
            </div>
          )
        })}
      </div>
    </>
  )
}

export default StepGrouping
