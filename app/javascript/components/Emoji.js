import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import constants from 'lib/utils/constants'
import './Emoji.scss'

const Emoji = ({ name, badge, own, selected, onAdd, onRemove }) => {
  const handleClick = (event) => {
    event.stopPropagation()

    if (selected && own) {
      onRemove(selected)
    } else {
      onAdd({ kind: 'emoji', name })
    }
  }

  return (
    <div className={classNames('emoji-chip', { 'selected': !!selected, 'own': own, [name.replace(/_/g, '-')]: true })} onClick={handleClick}>
      <span>{constants.emojiList[name]}</span>
      {(badge || 0) >= 1 && <span className='text-xs'>{badge}</span>}
    </div>
  )
}

Emoji.propTypes = {
  name: PropTypes.string.isRequired,
  badge: PropTypes.number,
  own: PropTypes.bool,
  selected: PropTypes.bool,
  onAdd: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired
}

export default Emoji
