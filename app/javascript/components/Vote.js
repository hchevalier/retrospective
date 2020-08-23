import React from 'react'
import classNames from 'classnames'
import constants from 'lib/utils/constants'
import './Emoji.scss'

const Vote = ({ badge, own, selected, disabled, onAdd, onRemove }) => {
  const [recentlyTouchedReaction, setRecentlyTouchedReaction] = React.useState(false)

  const touchReaction = () => {
    setRecentlyTouchedReaction(true)
    setTimeout(() => setRecentlyTouchedReaction(false), 50)
  }

  const handleClickAdd = React.useCallback((event) => {
    event.stopPropagation()
    if (recentlyTouchedReaction) return

    touchReaction()
    onAdd({ kind: 'vote', name: 'vote' })
  }, [recentlyTouchedReaction])

  const handleClickRemove = React.useCallback((event) => {
    event.stopPropagation()
    if (badge === 0 || recentlyTouchedReaction) return

    touchReaction()
    onRemove(selected)
  }, [badge, selected, recentlyTouchedReaction])

  return (
    <div className={classNames('emoji-chip', { 'selected': !!selected, 'own': own })}>
      {onRemove && <span onClick={handleClickRemove} className={classNames('unvote', { 'disabled': badge === 0 })}>{constants.unvoteEmoji}</span>}
      {<span className='vote-count'>{badge || 0}</span>}
      {onAdd && <span onClick={handleClickAdd} className={classNames('vote', { 'disabled': disabled })}>{constants.voteEmoji}</span>}
    </div>
  )
}

export default Vote
