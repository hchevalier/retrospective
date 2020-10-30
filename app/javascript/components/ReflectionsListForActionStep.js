import React from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import StickyBookmark from './StickyBookmark'
import Card from './Card'
import VoteCorner from './VoteCorner'
import InlineTopic from './InlineTopic'
import TrafficLightResult from './retrospectives/traffic_lights/TrafficLightResult'
import './ReflectionsList.scss'

const ReflectionsListForActionStep = () => {
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
      <div id='reflections-panel' className='relative flex flex-row'>
        <Card title='Voted topics' vertical wrapperClassName='screen-limited fixed top-18'>
          <div id='reflections-container' className='transition-width duration-500 ease-in-out w-0 overflow-x-hidden w-64'>
            {['open', 'limited'].includes(zonesTypology) && reflectionsWithVotes.map(([reflection, votes]) => {
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
                let selected = reflection.id == currentReflection?.id ? 'shadow-md' : 'mx-2'
                return (
                  <StickyBookmark key={reflection.id} color={reflection.color} otherClassNames={selected} onClick={() => handleStickyBookmarkClicked(reflection)}>
                    <VoteCorner target={reflection} targetType={'reflection'} votes={votes} inline noStandOut /> <span>{reflection.content}</span>
                  </StickyBookmark>
                )
              }
            })}
            {zonesTypology === 'single_choice' && reflectionsWithVotes.map(([reflection]) => {
              return (
                <div id={reflection.zone.id} key={reflection.id} onClick={() => handleStickyBookmarkClicked(reflection)}>
                  <TrafficLightResult reflection={reflection} />
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </>
  )
}

export default ReflectionsListForActionStep
