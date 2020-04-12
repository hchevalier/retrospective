import React from 'react'
import { useSelector } from 'react-redux'
import classNames from 'classnames'
import Button from '@material-ui/core/Button'
import './ParticipantsList.scss'

const ParticipantsList = () => {
  const profile = useSelector(state => state.profile)
  const step = useSelector(state => state.step)
  const participants = useSelector(state => state.participants)
  const channel = useSelector(state => state.orchestrator)

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

  const handleParticipantClick = (event) => {
    if (profile?.organizer && step === 'grouping') {
      const uuid = event.currentTarget.dataset.id
      channel.setRevealer(uuid)
    }
  }

  return (
    <div id='participants-list'>
      {participants.map(({ surname, status, organizer, revealer, uuid, color }, index) => (
        <div className='participant' key={index} data-id={uuid} onClick={handleParticipantClick}>
          <div className={classNames('participant-status', { 'logged-in': status })} />
          <div
            className={classNames('participant-name', { 'organizer': organizer, 'revealer': revealer, 'yourself': profile?.uuid === uuid })}
            style={{ backgroundColor: color }}>
            {surname}
          </div>
        </div>
      ))}
      {profile?.organizer && <Button variant='contained' color='primary' onClick={copyUrlToClipboard}>+</Button>}
    </div>
  )
}

export default ParticipantsList
