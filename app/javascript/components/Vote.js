import React from 'react'
import classNames from 'classnames'
import constants from 'lib/utils/constants'
import './Emoji.scss'

const Vote = ({ badge, own, selected, disabled, onAdd, onRemove }) => {
  const handleClickAdd = React.useCallback(() => {
    onAdd({ kind: 'vote', name: 'vote' })
  })
  const handleClickRemove = React.useCallback(() => {
    onRemove(selected)
  })

  return (
    <div className={classNames('emoji-chip', { 'selected': !!selected, 'own': own })}>
      {onRemove && <span onClick={handleClickRemove} className={classNames('unvote', { 'disabled': badge === 0 })}>{constants.unvoteEmoji}</span>}
      {<span style={{ margin: '0 5px' }}>{badge || 0}</span>}
      {onAdd && <span onClick={handleClickAdd} className={classNames('vote', { 'disabled': disabled })}>{constants.voteEmoji}</span>}
    </div>
  )
}

export default Vote
