import React from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import classNames from 'classnames'
import StickyBookmark from './StickyBookmark'
import VoteCorner from './VoteCorner'
import InlineTopic from './InlineTopic'
import TrafficLightResult from './retrospectives/traffic_lights/TrafficLightResult'
import ArrowIcon from 'images/arrow-icon-black.svg'
import './ReflectionsList.scss'

const ReflectionsListForActionStep = ({ open, onToggle }) => {
  const { facilitator } = useSelector(state => state.profile)
  const visibleReflections = useSelector(state => state.reflections.visibleReflections, shallowEqual)
  const currentReflection = useSelector(state => state.reflections.discussedReflection)
  const visibleReactions = useSelector(state => state.reactions.visibleReactions, shallowEqual)
  const channel = useSelector(state => state.orchestrator.subscription)
  const { zonesTypology, kind } = useSelector(state => state.retrospective)

  const reflectionsWithVotes = visibleReflections.map((reflection) => {
    const reactions = visibleReactions.filter((reaction) => {
      return reaction.targetId === `Reflection-${reflection.id}` || reaction.targetId === `Topic-${reflection.topic?.id}`
    })
    const votes = reactions.filter((reaction) => reaction.kind === 'vote')
    return [reflection, votes]
  }).sort((a, b) => b[1].length - a[1].length)

  const handleStickyBookmarkClicked = React.useCallback((reflection) => {
    if (facilitator) {
      channel.changeDiscussedReflection(reflection.id)
    }
  }, [facilitator, channel])

  const topics = {}

  return (
    <>
      <div id='reflections-panel' className='bg-gray-200 relative p-4 shadow-right flex flex-row'>
        <div className='justify-start items-start px-2 w-10'>
          <img className={classNames('cursor-pointer duration-200 ease-in-out transition-transform transform rotate-90', { '-rotate-90': open })} src={ArrowIcon} width="24" onClick={onToggle} />
        </div>
        <div id='reflections-container' className={classNames('transition-width duration-500 ease-in-out w-0 overflow-x-hidden', { 'w-64': open })}>
          <div className='font-bold'>Voted topics</div>
          {zonesTypology === 'open' && reflectionsWithVotes.map(([reflection, votes]) => {
            if (reflection.topic?.id && !topics[reflection.topic.id]) {
              topics[reflection.topic.id] = reflection.topic
              return <InlineTopic
                key={reflection.topic.id}
                reflection={reflection}
                allReflections={visibleReflections}
                reactions={visibleReactions}
                selectedReflection={currentReflection}
                onItemClick={handleStickyBookmarkClicked} />
            } else if (!reflection.topic?.id) {
              let selected = reflection.id == currentReflection.id ? 'shadow-md' : 'mx-2'
              return (
                <StickyBookmark key={reflection.id} color={reflection.color} otherClassNames={selected} onClick={() => handleStickyBookmarkClicked(reflection)}>
                  <VoteCorner target={reflection} targetType={'reflection'} votes={votes} inline noStandOut /> <span>{reflection.content}</span>
                </StickyBookmark>
              )
            }
          })}
          {zonesTypology === 'single_choice' && reflectionsWithVotes.map(([reflection]) => {
            return (
              <div id={kind} key={reflection.id} onClick={() => handleStickyBookmarkClicked(reflection)}>
                <TrafficLightResult reflection={reflection} />
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default ReflectionsListForActionStep
