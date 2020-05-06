import React from 'react'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import classNames from 'classnames'
import { post, destroy } from 'lib/httpClient'
import Vote from './Vote'
import './VoteCorner.scss'
import constants from 'lib/utils/constants'
import PropTypes from 'prop-types'

const VoteCorner = ({ canVote, reflection, votes, noStandOut = false, inline = false }) => {
  const dispatch = useDispatch()

  const profile = useSelector(state => state.profile)
  const retrospectiveId = useSelector(state => state.retrospective.id)
  const allOwnVotes = useSelector(state => state.reactions.ownReactions, shallowEqual).filter((reaction) => reaction.kind === 'vote')

  const createVote = () => {
    post({
      url: `/retrospectives/${retrospectiveId}/reflections/${reflection.id}/reactions`,
      payload: { kind: 'vote' }
    })
      .then(data => dispatch({ type: 'add-reaction', reaction: data }))
      .catch(error => console.warn(error))
  }

  const removeVote = (reaction) => {
    destroy({ url: `/retrospectives/${retrospectiveId}/reflections/${reflection.id}/reactions/${reaction.id}` })
      .then(() => dispatch({ type: 'delete-reaction', reactionId: reaction.id }))
      .catch(error => console.warn(error))
  }

  const ownVotes = votes.filter((vote) => vote.authorId === profile.uuid)
  const remainingVotes = constants.maxVotes - allOwnVotes.length
  const displayedVotes = canVote ? ownVotes : votes

  return (
    <div className={classNames('vote-corner', { inline })}>
      <Vote
        selected={ownVotes[0] || displayedVotes[0]}
        own={!noStandOut && ownVotes.length > 0}
        disabled={remainingVotes === 0}
        badge={displayedVotes.length}
        onAdd={canVote ? createVote : undefined}
        onRemove={canVote ? removeVote : undefined} />
    </div>
  )
}

VoteCorner.propTypes = {
  canVote: PropTypes.bool,
  reflection: PropTypes.object,
  votes: PropTypes.array,
  noStandOut: PropTypes.bool,
  inline: PropTypes.bool
}

export default VoteCorner
