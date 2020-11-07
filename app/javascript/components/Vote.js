import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
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
  }, [recentlyTouchedReaction, onAdd])

  const handleClickRemove = React.useCallback((event) => {
    event.stopPropagation()
    if (badge === 0 || recentlyTouchedReaction) return

    touchReaction()
    onRemove(selected)
  }, [badge, selected, recentlyTouchedReaction, onRemove])

  return (
    <div className={classNames('emoji-chip', { 'selected': !!selected, 'own': own })}>
      {onRemove && <span onClick={handleClickRemove} className={classNames('unvote', { 'disabled': badge === 0 })}>{constants.unvoteEmoji}</span>}
      {<span className='vote-count'>{badge || 0}</span>}
      {onAdd && <span onClick={handleClickAdd} className={classNames('vote', { 'disabled': disabled })}>{constants.voteEmoji}</span>}
    </div>
  )
}

Vote.propTypes = {
  badge: PropTypes.number,
  disabled: PropTypes.bool,
  onAdd: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  own: PropTypes.bool,
  selected: PropTypes.bool
}

export default Vote
