import React from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import StickyNote from './StickyNote'
import Icon from './Icon'
import './StepGrouping.scss'

const isVisible = (reflectionId, mode = 'visible', threshold = 20) => {
  const element = document.querySelector(`.reflection[data-id='${reflectionId}']`)
  if (!element) return false

  const rect = element.getBoundingClientRect()
  const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight)
  const isAbove = rect.bottom - threshold < 0
  const isBelow = rect.top - viewHeight + threshold >= 0

  return mode === 'above' ? isAbove : (mode === 'below' ? isBelow : !isAbove && !isBelow)
}

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
        const visible = isVisible(reflectionId)
        if (visible && !visibleReflections.find((visibleReflectionId) => visibleReflectionId === reflectionId)) {
          setVisibleReflections([...visibleReflections, reflectionId])

          setTimeout(() => {
            if (isVisible(reflectionId)) {
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

  React.useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }

    setTimeout(() => {
      const latestReflection = reflections[reflections.length - 1]
      if (!latestReflection) return

      if (!isVisible(latestReflection.id) && latestReflection.owner.uuid !== profile.uuid) {
        setUnreadReflection(latestReflection)
      }
    }, 500)
  }, [reflections])

  return (
    <>
      {organizer && <div>Click on a participant so that he can reveal his reflections</div>}
      {!organizer && <div>The organizer now chooses a participant so that he can reveal his reflections</div>}
      <div id='zones-container'>
        {zones.map((zone) => {
          const unreadFromColumn = columnsWithUnreadReflections[zone.id] || []
          const unreadReflectionAbove = !!unreadFromColumn.find((reflectionId) => isVisible(reflectionId, 'above'))
          const unreadReflectionBelow = !!unreadFromColumn.find((reflectionId) => isVisible(reflectionId, 'below'))

          return (
            <div className='zone-column' key={zone.id}>
              <span className='zone-header'>{<Icon retrospectiveKind={kind} zone={zone.name} />}{zone.name}</span>
              <div className='scrolling-zone'>
                {reflections.filter((reflection) => reflection.zone.id === zone.id).map((reflection) => {
                  const concernedReactions = reactions.filter((reaction) => reaction.targetId === `Reflection-${reflection.id}`)
                  const isUnread = !!unreadFromColumn.find((reflectionId) => reflectionId === reflection.id)
                  return <StickyNote key={reflection.id} reflection={reflection} showReactions reactions={concernedReactions} glowing={isUnread} />
                })}
              </div>
              {unreadReflectionAbove && <div className='unread-notice above'>⬆︎ Unread reflection ⬆︎</div>}
              {unreadReflectionBelow && <div className='unread-notice below'>⬇︎ Unread reflection ⬇︎</div>}
            </div>
          )
        })}
      </div>
    </>
  )
}

export default StepGrouping
