import React from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import classNames from 'classnames'
import { compact } from 'lib/helpers/array'
import { decrypt } from 'lib/utils/decryption'
import StickyBookmark from './StickyBookmark'
import './ParticipantsList.scss'

const ParticipantsList = () => {
  const profile = useSelector(state => state.profile)
  const { name: retrospectiveName } = useSelector(state => state.retrospective)
  const { organizerInfo: encryptedOrganizerInfo, step } = useSelector(state => state.orchestrator)
  const participants = useSelector(state => state.participants, shallowEqual)
  const channel = useSelector(state => state.orchestrator.subscription)
  const [alreadyRevealers, setAlreadyRevealers] = React.useState([])

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

  const pickRandomRevealer = () => {
    let remainingParticipants = participants.filter(participant => !alreadyRevealers.includes(participant.uuid))
    const randomRevealer = remainingParticipants[Math.floor(Math.random() * remainingParticipants.length)]
    setAlreadyRevealers([...alreadyRevealers, randomRevealer.uuid])
    channel.setRevealer(randomRevealer.uuid)
  }

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
    <div id='participants-list' className='border p-3 rounded shadow mr-6'>
      {participants.map(({ surname, status, organizer, revealer, uuid, color }, index) => {
        const flags = compact([profile?.uuid === uuid && 'you', organizer && 'orga.', revealer && 'reveal.']).join(', ')
        return (
          <div className='participant flex items-center' key={index} data-id={uuid} onClick={handleParticipantClick}>
            <div className={classNames('participant-status', { 'logged-in': status })} />
            <StickyBookmark otherClassNames={{ 'space-between': 'space-between', 'organizer': organizer, 'revealer': revealer, 'yourself': profile?.uuid === uuid }} color={color}>
              <span>{surname}</span> {flags && <span className='flags'>({flags})</span>}
              {step === 'voting' && organizerInfo[uuid] && <span className='remaining-votes'>{organizerInfo[uuid].remainingVotes}</span>}
            </StickyBookmark>
          </div>
        )
      })}
      {profile?.organizer && (
        <button
          className='bg-blue-500 focus:outline-none focus:shadow-outline font-medium hover:bg-blue-700 mt-6 px-5 py-1 rounded text-white'
          color='primary' onClick={copyUrlToClipboard}>
          +
        </button>
      )}
      {profile?.organizer && step === 'grouping' && alreadyRevealers.length < participants.length && (
        <button
        className='bg-blue-400 focus:outline-none focus:shadow-outline font-medium hover:bg-blue-600 mt-6 px-5 py-1 rounded text-white'
        color='primary' onClick={pickRandomRevealer}>
          Random revealer
        </button>
      )}
      {alreadyRevealers.length >= participants.length && (
        <p>Everyone has revealed!</p>
      )}
    </div>
  )
}

export default ParticipantsList
