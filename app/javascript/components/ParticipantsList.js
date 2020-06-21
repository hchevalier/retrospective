import React from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import { decrypt } from 'lib/utils/decryption'
import Avatar from './Avatar'
import './ParticipantsList.scss'

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

const ParticipantsList = () => {
  const profile = useSelector(state => state.profile)
  const { name: retrospectiveName } = useSelector(state => state.retrospective)
  const { organizerInfo: encryptedOrganizerInfo, step } = useSelector(state => state.orchestrator)
  const participants = useSelector(state => state.participants, shallowEqual)
  const channel = useSelector(state => state.orchestrator.subscription)

  const handleParticipantClick = (event) => {
    if (profile?.organizer && step === 'grouping') {
      const uuid = event.currentTarget.dataset.id
      channel.setRevealer(uuid)
    }
  }

  const organizerInfo = React.useMemo(() => {
    const { organizer, decryptionKey } = profile

    if (!organizer) return {}

    const encodedName = btoa(retrospectiveName)
    const initializationVector = encodedName.length < 16 ? encodedName + '0'.repeat(16 - encodedName.length) : encodedName
    const message = decrypt(encryptedOrganizerInfo, decryptionKey, initializationVector)
    if (message !== '') {
      return JSON.parse(message)
    }

    return {}
  }, [encryptedOrganizerInfo, profile, retrospectiveName])

  return (
    <div id='participants-list' className='flex flex-row'>
      {participants.map(({ surname, status, organizer, revealer, uuid, color }, index) => {
        const overlay = step === 'voting' && organizerInfo[uuid] ?
          <span className='remaining-votes'>{organizerInfo[uuid].remainingVotes}</span> : null

        return (
          <Avatar
            key={index}
            data-id={uuid}
            backgroundColor={color}
            loggedIn={status}
            surname={surname}
            self={profile?.uuid === uuid}
            onClick={handleParticipantClick}
            overlay={overlay}
            flags={{ organizer, revealer }} />
        )
      })}
      <button
        className='add-new bg-blue-500 hover:bg-blue-700 focus:outline-none focus:shadow-outline font-medium rounded text-white mx-1'
        color='primary' onClick={copyUrlToClipboard}>
        +
        </button>
    </div>
  )
}

export default ParticipantsList
