import React from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import StickyNote from './StickyNote'
import Icon from './Icon'
import './StepGrouping.scss'

const isVisible = (reflectionId, mode = 'visible', threshold = 0) => {
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

  const setUnreadReflection = (reflection) => {
    const alreadyTracked = columnsWithUnreadReflections[reflection.zone.id] || []
    setColumnsWithUnreadReflections({ ...columnsWithUnreadReflections, [reflection.zone.id]: [...alreadyTracked, reflection.id] })
  }

  const handleScroll = () => {
    Object.entries(columnsWithUnreadReflections).map(([column, reflectionsFromColumn]) => {
      reflectionsFromColumn.map((reflectionId) => {
        if (isVisible(reflectionId)) {
          setTimeout(() => {
            if (isVisible(reflectionId)) {
              const filteredReflections = (columnsWithUnreadReflections[column] || []).filter((trackedReflectionId) => trackedReflectionId !== reflectionId)
              setColumnsWithUnreadReflections({ ...columnsWithUnreadReflections, [column]: filteredReflections })
            }
          }, 2000)
        }
      })
    })
  }

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [columnsWithUnreadReflections])

  // TODO: do not trigger this effect on first render
  React.useEffect(() => {
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
          const anyAbove = !!unreadFromColumn.find((reflectionId) => isVisible(reflectionId, 'above'))
          const anyBelow = !!unreadFromColumn.find((reflectionId) => isVisible(reflectionId, 'above'))
          // TODO: add a floating notice at top of column if anyAbove
          // TODO: add a floating notice at bottom of column if anyBelow
          return (
            <div className='zone-column' key={zone.id}>
              <span>{<Icon retrospectiveKind={kind} zone={zone.name} />}{zone.name}</span>
              {reflections.filter((reflection) => reflection.zone.id === zone.id).map((reflection) => {
                const concernedReactions = reactions.filter((reaction) => reaction.targetId === `Reflection-${reflection.id}`)
                const isUnread = !!unreadFromColumn.find((reflectionId) => reflectionId === reflection.id)
                return <StickyNote key={reflection.id} reflection={reflection} showReactions reactions={concernedReactions} glowing={isUnread} />
              })}
            </div>
          )
        })}
      </div>
    </>
  )
}

export default StepGrouping
