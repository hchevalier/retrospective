import React from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import PropTypes from 'prop-types'
import { decrypt } from 'lib/utils/decryption'
import { uniqBy } from 'lib/helpers/array'
import Avatar from './Avatar'
import Button from './Button'
import MegaphoneIcon from 'images/megaphone-icon.svg'
import LightBulbIcon from 'images/lightbulb-icon.svg'
import SpeechBubbleIcon from 'images/speech-bubble-icon.svg'
import CheckIcon from 'images/check-icon.svg'

const ParticipantsList = ({ onAddParticipantsClick }) => {
  const profile = useSelector(state => state.profile)
  const { id: retrospectiveId } = useSelector(state => state.retrospective)
  const { facilitatorInfo: encryptedFacilitatorInfo, step } = useSelector(state => state.orchestrator)
  const participants = useSelector(state => state.participants, shallowEqual)
  const visibleReflections = useSelector(state => state.reflections.visibleReflections, shallowEqual)
  const channel = useSelector(state => state.orchestrator.subscription)

  const handleParticipantClick = (event) => {
    if (profile?.facilitator && step === 'grouping') {
      const uuid = event.currentTarget.dataset.id
      channel.setRevealer(uuid)
    }
  }

  const facilitatorInfo = React.useMemo(() => {
    const { facilitator, decryptionKey } = profile

    if (!facilitator) return {}

    const encodedName = btoa(retrospectiveId)
    const initializationVector = encodedName.length < 16 ? encodedName + '0'.repeat(16 - encodedName.length) : encodedName
    const message = decrypt(encryptedFacilitatorInfo, decryptionKey, initializationVector)
    if (message !== '') {
      return JSON.parse(message)
    }

    return {}
  }, [encryptedFacilitatorInfo, profile, retrospectiveId])

  const revealers = uniqBy(visibleReflections.map((reflection) => reflection.owner), 'uuid').map(participant => participant.uuid)

  const displayFacilitatorInfo = (revealer, uuid) => {
    if (!profile?.facilitator) return null

    const children = []

    if (step === 'thinking' && profile?.facilitator) {
      if (facilitatorInfo[uuid]?.stepDone)
        children.push(<img key='check' className='flex-row absolute right-0 check' src={CheckIcon} width='12' />)
      else
        children.push(<img key='lightbulb' className='flex-row absolute right-0 light-bulb' src={LightBulbIcon} width='12' />)
    }

    if (step === 'grouping' && !revealer && revealers.includes(uuid))
      children.push(<img key='check' className='flex-row absolute right-0 check' src={CheckIcon} width='12' />)

    if (step === 'voting' && facilitatorInfo[uuid])
      children.push(<span key='remaining-votes' className='remaining-votes absolute flex right-0 text-xs pr-1'>{facilitatorInfo[uuid].remainingVotes}</span>)

    return <>{children}</>
  }

  const avatarClickable = channel && !channel.consumer.connection.disconnected

  return (
    <div id='participants-list' className='flex flex-row'>
      {participants.map(({ surname, status, facilitator, revealer, uuid, color }, index) => {
        return (
          <Avatar
            key={index}
            dataAttributes={{ 'data-id': uuid}}
            backgroundColor={color}
            loggedIn={status}
            surname={surname}
            self={profile?.uuid === uuid}
            onClick={avatarClickable ? handleParticipantClick : null}
            flags={{ facilitator, revealer }}>
            {facilitator && <img className='facilitator flex-row absolute left-0' src={MegaphoneIcon} width='12' />}
            {revealer && <img className='revealer flex-row absolute right-0' src={SpeechBubbleIcon} width='12' />}
            {displayFacilitatorInfo(revealer, uuid)}
          </Avatar>
        )
      })}
      <Button primary contained className='add-new w-12 h-12' onClick={onAddParticipantsClick}>+</Button>
    </div>
  )
}

ParticipantsList.propTypes = {
  onAddParticipantsClick: PropTypes.func.isRequired
}

export default ParticipantsList
