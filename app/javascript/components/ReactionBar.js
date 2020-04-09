import React from 'react'
import { post, destroy } from 'lib/httpClient'
import './ReactionBar.scss'
import { useDispatch, useSelector } from 'react-redux'

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

  const reactionsBlock = reactions.map((reaction, index) => {
    // TODO: group by reaction.kind and display a badge with count
    return <div className='reaction' key={index} data-id={reaction.id} onClick={handleRemoveReaction}>{reaction.content}</div>
  })

  return (
    <div className='reactions-bar'>
      <div onClick={handleAddVote}>+</div>
      {reactionsBlock}
    </div>
  )
}

export default ReactionBar
