import React from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import classNames from 'classnames'
import constants from 'lib/utils/constants'
import { CircularProgress } from '@material-ui/core'
import './Emoji.scss'

const Vote = ({ badge, own, selected, disabled, onAdd, onRemove }) => {
  const pendingNetworkCalls = useSelector(state => state.pendingNetworkCalls, shallowEqual)
  const addingReaction = pendingNetworkCalls.find((item) => item === 'add-reaction')
  const deletingReaction = pendingNetworkCalls.find((item) => item === 'delete-reaction')

  const handleClickAdd = React.useCallback(() => {
    if (addingReaction) {
      return
    }
    onAdd({ kind: 'vote', name: 'vote' })
  }, [addingReaction])

  const handleClickRemove = React.useCallback(() => {
    if (deletingReaction) {
      return
    }
    onRemove(selected)
  }, [selected, deletingReaction])

  const voteEmoji = addingReaction ? <CircularProgress style={{ 'width': '15px', 'height': '15px' }} /> : constants.voteEmoji
  const unvoteEmoji = deletingReaction ? <CircularProgress style={{ 'width': '15px', 'height': '15px' }} /> : constants.unvoteEmoji

  return (
    <div className={classNames('emoji-chip', { 'selected': !!selected, 'own': own })}>
      {onRemove && <span onClick={handleClickRemove} className={classNames('unvote', { 'disabled': badge === 0 })}>{unvoteEmoji}</span>}
      {<span className='vote-count'>{badge || 0}</span>}
      {onAdd && <span onClick={handleClickAdd} className={classNames('vote', { 'disabled': disabled })}>{voteEmoji}</span>}
    </div>
  )
}

export default Vote
