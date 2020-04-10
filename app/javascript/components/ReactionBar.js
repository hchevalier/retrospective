import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { post, destroy } from 'lib/httpClient'
import { groupBy } from 'lib/helpers/array'
import './ReactionBar.scss'

const ReactionBar = ({ reflection, displayed, reactions }) => {
  if (!displayed) return null

  const dispatch = useDispatch()

  const retrospectiveId = useSelector(state => state.retrospective.id)

  const handleAddVote = React.useCallback(() => {
    post({
      url: `/retrospectives/${retrospectiveId}/reflections/${reflection.id}/reactions`,
      payload: { kind: 'vote' }
    })
    .then(data => dispatch({ type: 'add-reaction', reaction: data }))
    .catch(error => console.warn(error))
  })

  const handleRemoveReaction = React.useCallback((event) => {
    const reactionId = event.currentTarget.dataset.id
    destroy({ url: `/retrospectives/${retrospectiveId}/reflections/${reflection.id}/reactions/${reactionId}` })
    .then(_data => dispatch({ type: 'delete-reaction', reactionId: reactionId }))
    .catch(error => console.warn(error))
  })

  const groups = groupBy(reactions, 'content')
  const reactionsBlock = Object.keys(groups).map((reactionContent, index) => {
    const reactionsInGroup = groups[reactionContent]
    const reactionsCount = reactionsInGroup.length
    return (
      <div className='reaction' key={index} data-id={reactionsInGroup[0].id} onClick={handleRemoveReaction}>
        {reactionsCount > 1 ? reactionsCount : ''}{reactionContent}
      </div>
    )
  })

  return (
    <div className='reactions-bar'>
      <div onClick={handleAddVote}>+</div>
      {reactionsBlock}
    </div>
  )
}

export default ReactionBar
