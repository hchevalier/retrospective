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

    const kind = event.currentTarget.dataset.kind
    const content = event.currentTarget.innerText

    post({
      url: `/retrospectives/${retrospectiveId}/reflections/${reflection.id}/reactions`,
      payload: { kind, content }
    })
    .then(data => dispatch({ type: 'add-reaction', reaction: data }))
    .catch(error => console.warn(error))
  })

  const handleOpenReactionChoices = () => setEmojiDisplayed(true)
  const handleCloseReactionChoices = () => setEmojiDisplayed(false)

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

  if (!displayed) return null

  return (
    <div className='reactions-bar'>
      {emojiDisplayed && (
        <div className='emoji-modal'>
          <div className='emoji-container'>
            {votingPhase && <span onClick={handleAddReaction} data-kind='vote'>🥇</span>}
            {!votingPhase && (
              <>
                <span onClick={handleAddReaction} data-kind='emoji'>😂</span>
                <span onClick={handleAddReaction} data-kind='emoji'>😅</span>
                <span onClick={handleAddReaction} data-kind='emoji'>🤩</span>
                <span onClick={handleAddReaction} data-kind='emoji'>🤗</span>
                <span onClick={handleAddReaction} data-kind='emoji'>🤯</span>
                <span onClick={handleAddReaction} data-kind='emoji'>😡</span>
                <span onClick={handleAddReaction} data-kind='emoji'>🤔</span>
                <span onClick={handleAddReaction} data-kind='emoji'>🙏</span>
                <span onClick={handleAddReaction} data-kind='emoji'>👏</span>
                <span onClick={handleAddReaction} data-kind='emoji'>💪</span>
                <span onClick={handleAddReaction} data-kind='emoji'>🤞</span>
                <span onClick={handleAddReaction} data-kind='emoji'>🚀</span>
                <span onClick={handleAddReaction} data-kind='emoji'>🔥</span>
              </>
            )}
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
