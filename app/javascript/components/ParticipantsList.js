import React from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import { decrypt } from 'lib/utils/decryption'
import { uniqBy } from 'lib/helpers/array'
import Avatar from './Avatar'
import MegaphoneIcon from 'images/megaphone-icon.svg'
import LightBulbIcon from 'images/lightbulb-icon.svg'
import SpeechBubbleIcon from 'images/speech-bubble-icon.svg'
import CheckIcon from 'images/check-icon.svg'
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
  const visibleReflections = useSelector(state => state.reflections.visibleReflections, shallowEqual)
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

  const revealers = uniqBy(visibleReflections.map((reflection) => reflection.owner), 'uuid').map(participant => participant.uuid)

  const displayOrganizerInfo = (revealer, uuid) => {
    if (!profile?.organizer) return null

    const children = []

    if (step === 'thinking') {
      // TODO: display a check when participant clicked on "I'm done" button
      children.push(<img key='lightbulb' className='flex-row absolute right-0' src={LightBulbIcon} width='16' />)
    }

    if (step === 'grouping' && !revealer && revealers.includes(uuid))
      children.push(<img key='check' className='flex-row absolute right-0' src={CheckIcon} width='16' />)

    if (step === 'voting' && organizerInfo[uuid])
      children.push(<span key='remaining-votes' className='remaining-votes absolute flex right-0 p-1 text-xs rounded-full'>{organizerInfo[uuid].remainingVotes}</span>)

    return <>{children}</>
  }

  return (
    <div id='participants-list' className='flex flex-row'>
      {participants.map(({ surname, status, organizer, revealer, uuid, color }, index) => {
        return (
          <Avatar
            key={index}
            dataAttributes={{ 'data-id': uuid}}
            backgroundColor={color}
            loggedIn={status}
            surname={surname}
            self={profile?.uuid === uuid}
            onClick={handleParticipantClick}
            flags={{ organizer, revealer }}>
            {organizer && <img className='organizer flex-row absolute left-0' src={MegaphoneIcon} width='16' />}
            {revealer && <img className='revealer flex-row absolute right-0' src={SpeechBubbleIcon} width='16' />}
            {displayOrganizerInfo(revealer, uuid)}
          </Avatar>
        )
      })}
      <button
        className='add-new bg-blue-500 hover:bg-blue-700 focus:outline-none focus:shadow-outline font-medium rounded text-white ml-4'
        color='primary' onClick={copyUrlToClipboard}>
        +
        </button>
    </div>
  )
}

export default ParticipantsList
