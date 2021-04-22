import React from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { put } from 'lib/httpClient'
import constants from 'lib/utils/constants'
import Card from './Card'
import StickyNote from './StickyNote'
import Topic from './Topic'
import Icon from './Icon'

const EmotionBar = ({ zoneId }) => {
  const { id: retrospectiveId } = useSelector(state => state.retrospective)
  const profile = useSelector(state => state.profile)
  const dispatch = useDispatch()
  const emotionForZone = (profile.retrospectiveData.emotions || {})[zoneId]

  const updateRetrospectiveRelatedData = (emotion) => {
    put({
      url: `/retrospectives/${retrospectiveId}/participants/${profile.uuid}`,
      payload: { zone_id: zoneId, emotion }
    }).then(() => {
      const profileCopy = { ...profile }
      const currentEmotions = profileCopy.retrospectiveData.emotions || {}
      currentEmotions[zoneId] = emotion
      profileCopy.retrospectiveData.emotions = currentEmotions
      dispatch({ type: 'refresh-participant', participant: profileCopy })
    })
  }

  return (
    <div className='flex flex-row justify-evenly mt-2'>
      <div className={classNames('rounded-full bg-red-200 px-2 cursor-pointer', { 'bg-red-500 active': emotionForZone === 1 })} onClick={() => updateRetrospectiveRelatedData(1)}>1</div>
      <div className={classNames('rounded-full bg-orange-200 px-2 cursor-pointer', { 'bg-orange-500 active': emotionForZone === 2 })} onClick={() => updateRetrospectiveRelatedData(2)}>2</div>
      <div className={classNames('rounded-full bg-yellow-200 px-2 cursor-pointer', { 'bg-yellow-500 active': emotionForZone === 3 })} onClick={() => updateRetrospectiveRelatedData(3)}>3</div>
      <div className={classNames('rounded-full bg-green-200 px-2 cursor-pointer', { 'bg-green-500 active': emotionForZone === 4 })} onClick={() => updateRetrospectiveRelatedData(4)}>4</div>
    </div>
  )
}

EmotionBar.propTypes = {
  zoneId: PropTypes.number.isRequired
}

const StepVoting = ({ onExpandTopic }) => {
  const { kind } = useSelector(state => state.retrospective)
  const reflections = useSelector(state => state.reflections.visibleReflections, shallowEqual)
  const zones = useSelector(state => state.retrospective.zones, shallowEqual)
  const ownReactions = useSelector(state => state.reactions.ownReactions, shallowEqual)
  const reactions = useSelector(state => state.reactions.visibleReactions, shallowEqual)

  const topics = {}
  const votes = ownReactions.filter((reaction) => reaction.kind === 'vote')
  const reactionsWithVotes = [...reactions, ...votes]

  const renderTopic = (reflection) => {
    const reflectionsInTopic = reflections.filter((otherReflection) => otherReflection.topic?.id === reflection.topic.id)
    const reflectionIds = reflectionsInTopic.map((otherReflection) => otherReflection.id)
    const reactionsInTopic = reactionsWithVotes.filter((reaction) => {
      return reflectionIds.includes(reaction.targetId.split(/-(.+)?/, 2)[1]) || reaction.targetId === `Topic-${reflection.topic.id}`
    })

    return <Topic
      key={reflection.topic.id}
      onClick={onExpandTopic}
      topic={reflection.topic}
      reflections={reflectionsInTopic}
      reactions={reactionsInTopic}
      showReactions
      showVotes />
  }

  return (
    <Card
      vertical
      className='pb-0 h-full'
      containerClassName='flex-1 px-4 h-full'>
      <div>Remaining votes: {constants.maxVotes - votes.length}</div>
      <div>You can also tell how you felt for each day</div>
      <div id='zones-container' className="flex w-full h-full overflow-x-scroll">
        {zones.map((zone) => {
          const reflectionsInZone = reflections.filter((reflection) => reflection.zone.id === zone.id)
          if (reflectionsInZone.length === 0) return <div key={zone.id} />

          return (
            <div className='zone-column border flex-1 m-2 p-4 rounded first:ml-0 last:mr-0 relative min-w-12' key={zone.id}>
              <div className='zone-header mb-4'>
                <Icon retrospectiveKind={kind} zone={zone.name} />
                {zone.name}
                {kind === 'timeline' && <EmotionBar zoneId={zone.id} />}
              </div>
              {reflectionsInZone.map((reflection) => {
                if (reflection.topic?.id && !topics[reflection.topic.id]) {
                  topics[reflection.topic.id] = reflection.topic
                  return renderTopic(reflection)
                } else if (!reflection.topic?.id) {
                  const relevantReactions = reactionsWithVotes.filter((reaction) => reaction.targetId === `Reflection-${reflection.id}`)

                  return <StickyNote
                    key={reflection.id}
                    reflection={reflection}
                    showReactions
                    showVotes
                    reactions={relevantReactions} />
                }
              })}
            </div>
          )
        })}
      </div>
    </Card>
  )
}

StepVoting.propTypes = {
  onExpandTopic: PropTypes.func
}

export default StepVoting
