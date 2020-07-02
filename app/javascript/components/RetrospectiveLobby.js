import React from 'react'
import { Provider, useSelector, useDispatch } from 'react-redux'
import appStore from 'stores'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { get } from 'lib/httpClient'
import consumer from 'channels/consumer'
import { join as joinOrchestratorChannel } from 'channels/orchestratorChannel'
import RetrospectiveArea from './RetrospectiveArea'
import ParticipantsList from './ParticipantsList'
import ReflectionsList from './ReflectionsList'
import FacilitatorToolkitLeft from './FacilitatorToolkitLeft'
import FacilitatorToolkitRight from './FacilitatorToolkitRight'
import LoginForm from './LoginForm'
import Modal from './Modal'
import HomeIcon from 'images/home-icon.svg'
import ArrowIcon from 'images/arrow-icon.svg'
import LinkIcon from 'images/link-icon.svg'
import './RetrospectiveLobby.scss'
import Button from './Button'


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

const RetrospectiveLobby = ({ id: retrospectiveId, group, kind }) => {
  const dispatch = useDispatch()
  const [participantsListVisible, setParticipantsListVisible] = React.useState(true)
  const [reflectionsListVisible, setReflectionsListVisible] = React.useState(true)
  const [displayAddParticipantsModal, setDisplayAddParticipantsModal] = React.useState(false)
  const [groupInfo, setGroupInfo] = React.useState(null)

  const profile = useSelector(state => state.profile)
  const revealer = useSelector(state => state.profile.revealer)
  const currentStep = useSelector(state => state.orchestrator.step)
  const channel = useSelector(state => state.orchestrator.subscription)
  const loggedIn = !!profile.uuid


  React.useEffect(() => {
    if (!group.id) return

    get({ url: `/api/groups/${group.id}` })
      .then((data) => setGroupInfo(data))
  }, [group.id])

  const handleOpenAddParticipantsModal = () => {
    setDisplayAddParticipantsModal(true)
  }

  const handleAddParticipantsModalClose = () => {
    setDisplayAddParticipantsModal(false)
  }

  const handleActionReceived = React.useCallback((action, data) => {
    if (action === 'newParticipant') {
      dispatch({ type: 'new-participant', newParticipant: data.profile })
    } else if (action === 'refreshParticipant') {
      dispatch({ type: 'refresh-participant', participant: data.participant })
    } else if (action === 'next') {
      dispatch({ type: 'change-step', step: data.next_step, visibleReflections: data.visibleReflections, discussedReflection: data.discussedReflection, visibleReactions: data.visibleReactions })
    } else if (action === 'setTimer') {
      dispatch({ type: 'start-timer', timerEndAt: data.timer_end_at })
    } else if (action === 'changeColor') {
      dispatch({ type: 'change-color', participant: data.participant, availableColors: data.availableColors })
    } else if (action === 'revealReflection') {
      dispatch({ type: 'reveal-reflection', reflection: data.reflection })
    } else if (action === 'newReaction') {
      dispatch({ type: 'push-reaction', reaction: data.reaction })
    } else if (action === 'dropReaction') {
      dispatch({ type: 'drop-reaction', reactionId: data.reactionId })
    } else if (action === 'setDiscussedReflection') {
      dispatch({ type: 'set-discussed-reflection', reflection: data.reflection })
    } else if (action === 'addTask') {
      dispatch({ type: 'add-task', task: data.task })
    } else if (action === 'updateTask') {
      dispatch({ type: 'change-task', task: data.task })
    } else if (action === 'dropTask') {
      dispatch({ type: 'drop-task', taskId: data.taskId })
    } else if (action === 'updateOrganizerInfo') {
      dispatch({ type: 'update-organizer-info', organizerInfo: data.organizerInfo })
    } else if (action === 'changeTopic') {
      dispatch({ type: 'change-topic', reflection: data.reflection })
    }
  }, [dispatch])

  React.useEffect(() => {
    if (channel) {
      consumer.subscriptions.remove(channel)
      consumer.disconnect()
    }
    const orchestratorChannel = joinOrchestratorChannel({ retrospectiveId: retrospectiveId, onReceivedAction: handleActionReceived })
    dispatch({ type: 'set-channel', subscription: orchestratorChannel })
  }, [loggedIn])

  const toggleParticipantsList = () => setParticipantsListVisible(!participantsListVisible)
  const shouldDisplayReflectionsList = currentStep === 'thinking' || currentStep === 'grouping'

  const handleReflectionsListToggle = () => {
    if (!reflectionsListVisible || !revealer) {
      setReflectionsListVisible(!reflectionsListVisible)
    }
  }

  const handleReflectionsListClose = React.useCallback(() => {
    if (revealer && channel) {
      channel.dropRevealerToken()
    }

    setReflectionsListVisible(false)
  }, [channel, revealer])

  return (
    <div id='main-container' className='flex flex-col min-h-screen'>
      <nav className="bg-gray-900 shadow text-white h-14 fixed w-full" role="navigation">
        <div className="container mx-auto p-4 flex flex-wrap items-center md:flex-no-wrap">
          <div className="mr-4 md:mr-8">
            <a href='/'>
              <img src={HomeIcon} width="24" />
            </a>
          </div>
          <div className="mr-4 md:mr-8">
            Lobby {group.name} - {kind}
          </div>
          <div className='flex flex-grow justify-end'>
            <img className={classNames('cursor-pointer duration-200 ease-in-out transition-transform', { 'transform rotate-180': participantsListVisible })} src={ArrowIcon} width="24" onClick={toggleParticipantsList} />
          </div>
        </div>
      </nav>
      <div className='flex flex-row flex-1 fixed w-full top-14'>
        {shouldDisplayReflectionsList && (
          <ReflectionsList
            open={reflectionsListVisible || revealer}
            retrospectiveKind={kind}
            onToggle={handleReflectionsListToggle}
            onDone={handleReflectionsListClose} />
        )}
        <div id='right-panel' className='flex flex-col flex-1 overflow-y-hidden'>
          <div className={classNames('bg-gray-200 mb-6 shadow text-white duration-200 ease-linear transform transition-height h-24 origin-top overflow-hidden', { '!h-0': !participantsListVisible })}>
            <div className="mx-auto p-4 flex flex-wrap items-center md:flex-no-wrap">
              <div className='flex flex-grow justify-end'>
                {profile?.organizer && <FacilitatorToolkitLeft />}
                <ParticipantsList onAddParticipantsClick={handleOpenAddParticipantsModal} />
                {profile?.organizer && <FacilitatorToolkitRight />}
              </div>
            </div>
          </div>
          {!loggedIn && <LoginForm retrospectiveId={retrospectiveId} />}
          {loggedIn && <RetrospectiveArea retrospectiveId={retrospectiveId} kind={kind} />}
        </div>
      </div>
      <Modal open={displayAddParticipantsModal} onClose={handleAddParticipantsModalClose}>
        <div>
          <div className='font-bold'>Group members</div>
          <div className='mb-4'>
            {groupInfo && groupInfo.members.map((member) => <div key={member.id}>{member.username}</div>)}
          </div>

          <textarea className='w-full border p-2 resize-none' name='email_addresses' rows='3' placeholder={`Enter email addresses of people you want to add to ${group.name}, separated with comas`} />
          <Button primary contained className='mt-2'>Send invites</Button>

          <div className='mt-4'>
            <div>You can also send them this link:</div>
            <div className='flex flex-row flex-no-wrap rounded-full border'>
              <div className='border-r p-2'><img src={LinkIcon} className='inline' width="24" /></div>
              <div className='overflow-x-scroll p-2 whitespace-no-wrap'>{window.location.href}</div>
              <div className='border-l py-2 px-4 bg-blue-500 hover:bg-blue-700 rounded-r-full text-white cursor-pointer' onClick={copyUrlToClipboard}>Copy</div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

RetrospectiveLobby.propTypes = {
  id: PropTypes.string.isRequired,
  group: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  kind: PropTypes.string.isRequired,
}

const RetrospectiveLobbyWithProvider = (props) => {
  const store = appStore({ ...props.initialState, retrospective: props.retrospective })

  return (
    <Provider store={store}>
      <RetrospectiveLobby {...props.retrospective} />
    </Provider>
  )
}

RetrospectiveLobbyWithProvider.propTypes = {
  initialState: PropTypes.object.isRequired,
  retrospective: PropTypes.object.isRequired
}

export default RetrospectiveLobbyWithProvider
