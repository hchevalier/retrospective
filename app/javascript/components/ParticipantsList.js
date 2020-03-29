import React from 'react'
import classNames from 'classnames'
import Button from '@material-ui/core/Button'

const ParticipantsList = ({ participants, profile }) => {
  const copyUrlToClipboard = () => {
    const toCopy = document.createElement('span')
    toCopy.setAttribute('type', 'hidden')
    toCopy.appendChild(document.createTextNode(window.location.href))
    document.body.appendChild(toCopy);
    const range = document.createRange()
    const selection = window.getSelection()

    range.selectNodeContents(toCopy)
    selection.removeAllRanges()
    selection.addRange(range)
    document.execCommand('copy')
    selection.removeAllRanges()

    toCopy.remove()
    alert('Copied invite URL to clipboard')
  }

  return (
    <div id='participants-list'>
      {participants.map(({ surname, organizer, uuid }, index) => (
        <div key={index} className={classNames({ 'organizer': organizer, 'yourself': profile?.uuid === uuid })}>
          {surname}
        </div>
      ))}
      {profile?.organizer && <Button variant='contained' color='primary' onClick={copyUrlToClipboard}>+</Button>}
    </div>
  )
}

export default ParticipantsList
