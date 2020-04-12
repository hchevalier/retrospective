import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { post, destroy } from 'lib/httpClient'
import { groupBy } from 'lib/helpers/array'
import './ReactionBar.scss'

const ReactionBar = ({ reflection, displayed, reactions, votingPhase }) => {
  const [emojiDisplayed, setEmojiDisplayed] = React.useState(false)

  const dispatch = useDispatch()

  const retrospectiveId = useSelector(state => state.retrospective.id)

  const handleAddReaction = React.useCallback((event) => {
    setEmojiDisplayed(false)
    createReaction({ kind: event.currentTarget.dataset.kind, content: event.currentTarget.innerText })
  })

  const createReaction = React.useCallback(({ kind, content }) => {
    post({
      url: `/retrospectives/${retrospectiveId}/reflections/${reflection.id}/reactions`,
      payload: { kind, content }
    })
    .then(data => dispatch({ type: 'add-reaction', reaction: data }))
    .catch(error => console.warn(error))
  })

  const handleOpenReactionChoices = () => {
    if (votingPhase) {
      createReaction({ kind: 'vote', content: '🥇' })
    } else {
      setEmojiDisplayed(true)
    }
  }
  const handleCloseReactionChoices = () => setEmojiDisplayed(false)

  const handleRemoveReaction = React.useCallback((event) => {
    // TODO: prevent removing reactions from other participants
    // TODO: prevent removing votes out of voting phase
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

  if (!displayed) return null

  const EMOJIS_BLOCK = (
    <>
      {['😂', '😅', '🤩', '🤗', '🤯', '😡', '🤔', '🙏', '👏', '💪', '🤞', '🚀', '🔥'].map((emoji, index) => {
        return <span key={index} onClick={handleAddReaction} data-kind='emoji'>{emoji}</span>
      })}
    </>
  )

  return (
    <div className='reactions-bar'>
      {emojiDisplayed && (
        <div className='emoji-modal'>
          <div className='emoji-container'>
            {votingPhase && <span onClick={handleAddReaction} data-kind='vote'>🥇</span>}
            {!votingPhase && EMOJIS_BLOCK}
          </div>
          <div className='cross' onClick={handleCloseReactionChoices}>X</div>
        </div>
      )}
      <div onClick={handleOpenReactionChoices}>+</div>
      {reactionsBlock}
    </div>
  )
}

export default ReactionBar
