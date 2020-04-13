import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { post, destroy } from 'lib/httpClient'
import { groupBy } from 'lib/helpers/array'
import Emoji from './Emoji'
import './ReactionBar.scss'

const ReactionBar = ({ reflection, displayed, reactions, votingPhase }) => {
  const [emojiDisplayed, setEmojiDisplayed] = React.useState(false)

  const dispatch = useDispatch()

  const profile = useSelector(state => state.profile)
  const step = useSelector(state => state.step)
  const retrospectiveId = useSelector(state => state.retrospective.id)

  const handleAddReaction = React.useCallback(({ kind, content }) => {
    setEmojiDisplayed(false)
    createReaction({ kind, content })
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

  const handleRemoveReaction = React.useCallback((reaction) => {
    if (reaction.kind === 'vote' && step !== 'voting') {
      return
    }

    setEmojiDisplayed(false)
    destroy({ url: `/retrospectives/${retrospectiveId}/reflections/${reflection.id}/reactions/${reaction.id}` })
    .then(_data => dispatch({ type: 'delete-reaction', reactionId: reaction.id }))
    .catch(error => console.warn(error))
  })

  const groups = groupBy(reactions, 'content')
  const reactionsBlock = Object.keys(groups).map((reactionContent, index) => {
    const reactionsInGroup = groups[reactionContent]
    const reactionsCount = reactionsInGroup.length
    const sample = reactionsInGroup.find((reaction) => reaction.authorId === profile.uuid) || reactionsInGroup[0]
    return (
      <Emoji
        key={index}
        selected={sample}
        own={sample?.authorId === profile.uuid}
        kind={sample.kind}
        content={sample.content}
        badge={reactionsCount}
        onAdd={handleAddReaction}
        onRemove={handleRemoveReaction} />
    )
  })

  if (!displayed) return null

  const emojisBlock = <>
    {['😂', '😅', '🤩', '🤗', '🤯', '😡', '🤔', '🙏', '👏', '💪', '🤞', '🚀', '🔥'].map((emoji, index) => {
      const reactionsOccurrences = reactions.filter((reaction) => reaction.content === emoji)
      const sample = reactionsOccurrences.find((reaction) => reaction.authorId === profile.uuid) || reactionsOccurrences[0]
      return (
        <Emoji
          key={index}
          selected={sample}
          own={sample?.authorId === profile.uuid}
          kind='emoji'
          content={emoji}
          onAdd={handleAddReaction}
          onRemove={handleRemoveReaction} />
      )
    })}
  </>

  return (
    <div className='reactions-bar'>
      {emojiDisplayed && (
        <div className='emoji-modal'>
          <div className='emoji-container'>
            {votingPhase && <span onClick={handleAddReaction} data-kind='vote'>🥇</span>}
            {!votingPhase && emojisBlock}
          </div>
          <div className='cross' onClick={handleCloseReactionChoices}>X</div>
        </div>
      )}
      <span className='add-reaction emoji-chip' onClick={handleOpenReactionChoices}>+</span>
      {reactionsBlock}
    </div>
  )
}

export default ReactionBar
