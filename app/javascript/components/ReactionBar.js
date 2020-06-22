import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { post, destroy } from 'lib/httpClient'
import { groupBy } from 'lib/helpers/array'
import Emoji from './Emoji'
import constants from 'lib/utils/constants'
import './ReactionBar.scss'

const ReactionBar = ({ reflection, displayed, reactions }) => {
  const [emojiDisplayed, setEmojiDisplayed] = React.useState(false)

  const dispatch = useDispatch()

  const profile = useSelector(state => state.profile)
  const retrospectiveId = useSelector(state => state.retrospective.id)

  const handleAddReaction = ({ kind, name }) => {
    setEmojiDisplayed(false)

    post({
      url: `/retrospectives/${retrospectiveId}/reflections/${reflection.id}/reactions`,
      payload: { kind, content: name }
    })
    .then(data => dispatch({ type: 'add-reaction', reaction: data }))
    .catch(error => console.warn(error))
  }

  const showEmojiModal = () => setEmojiDisplayed(true)
  const hideEmojiModal = () => setEmojiDisplayed(false)

  const handleRemoveReaction = (reaction) => {
    setEmojiDisplayed(false)

    destroy({ url: `/retrospectives/${retrospectiveId}/reflections/${reflection.id}/reactions/${reaction.id}` })
    .then(_data => dispatch({ type: 'delete-reaction', reactionId: reaction.id }))
    .catch(error => console.warn(error))
  }

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
        name={sample.content}
        badge={reactionsCount}
        onAdd={handleAddReaction}
        onRemove={handleRemoveReaction} />
    )
  })

  if (!displayed) return <div className='reactions-bar-placeholder h-6' />

  const emojisBlock = <>
    {Object.keys(constants.emojiList).map((emojiName, index) => {
      const reactionsOccurrences = reactions.filter((reaction) => reaction.content === emojiName)
      const sample = reactionsOccurrences.find((reaction) => reaction.authorId === profile.uuid) || reactionsOccurrences[0]
      return (
        <Emoji
          key={index}
          selected={sample}
          own={sample?.authorId === profile.uuid}
          name={emojiName}
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
            {emojisBlock}
          </div>
          <div className='cross' onClick={hideEmojiModal}>X</div>
        </div>
      )}
      <span className='add-reaction emoji-chip' onClick={showEmojiModal}>+</span>
      {reactionsBlock}
    </div>
  )
}

export default ReactionBar
