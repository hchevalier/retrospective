import React from 'react'
import classNames from 'classnames'
import './Emoji.scss'

const Emoji = ({ content, badge, kind, own, selected, onAdd, onRemove }) => {
  const handleClick = React.useCallback(() => {
    if (selected && own) {
      onRemove(selected)
    } else {
      onAdd({ kind: kind, content: content })
    }
  })

  return (
    <div className={classNames('emoji-chip', { 'selected': !!selected, 'own': own })} onClick={handleClick}>
      <span>{content}</span>
      {(badge || 0) > 1 && <span>{badge}</span>}
    </div>
  )
}

export default Emoji
