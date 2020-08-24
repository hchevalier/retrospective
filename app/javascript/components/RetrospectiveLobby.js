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
import ReflectionsListForActionStep from './ReflectionsListForActionStep'
import FacilitatorToolkitLeft from './FacilitatorToolkitLeft'
import FacilitatorToolkitRight from './FacilitatorToolkitRight'
import LoginForm from './LoginForm'
import AddGroupMembersModal from './AddGroupMembersModal'
import HomeIcon from 'images/home-icon.svg'
import ArrowIcon from 'images/arrow-icon.svg'
import './RetrospectiveLobby.scss'

const RetrospectiveLobby = ({ id: retrospectiveId, invitation, group, kind }) => {
  const dispatch = useDispatch()
  const [participantsListVisible, setParticipantsListVisible] = React.useState(true)
  const [reflectionsListVisible, setReflectionsListVisible] = React.useState(true)
  const [displayAddParticipantsModal, setDisplayAddParticipantsModal] = React.useState(false)
  const [groupInfo, setGroupInfo] = React.useState(null)

  const profile = useSelector(state => state.profile)
  const revealer = useSelector(state => state.profile.revealer)
  const currentStep = useSelector(state => state.orchestrator.step)
  const channel = useSelector(state => state.orchestrator.subscription)
  const zonesTypology = useSelector(state => state.retrospective.zonesTypology)
  const loggedIn = !!profile.uuid

  React.useEffect(() => {
    if (!group.id || !loggedIn) return

    get({ url: `/api/groups/${group.id}` })
      .then((data) => setGroupInfo(data))
  }, [group.id, loggedIn])

  React.useEffect(() => {
    if (!loggedIn) return

    window.history.replaceState({}, '', window.location.pathname)
  }, [loggedIn])

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
      dispatch({ type: 'change-step', step: data.next_step, visibleReflections: data.visibleReflections, discussedReflection: data.discussedReflection, visibleReactions: data.visibleReactions, pendingTasks: data.pendingTasks })
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
    } else if (action === 'updatePendingTask') {
      dispatch({ type: 'change-pending-task', task: data.task })
    } else if (action === 'dropTask') {
      dispatch({ type: 'drop-task', taskId: data.taskId })
    } else if (action === 'updateFacilitatorInfo') {
      dispatch({ type: 'update-facilitator-info', facilitatorInfo: data.facilitatorInfo })
    } else if (action === 'changeTopic') {
      if (data.reflection) {
        dispatch({ type: 'change-topic', reflection: data.reflection })
      } else {
        dispatch({ type: 'change-topic', topic: data.topic })
      }
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
  const shouldDisplayReflectionsList = (currentStep === 'thinking' && zonesTypology === 'open') || currentStep === 'grouping' || currentStep === 'actions'

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

  const pushedLeft = reflectionsListVisible || revealer || (profile?.facilitator && currentStep === 'actions')

  return (
    <div id='main-container' className='flex flex-col min-h-screen'>
      <nav className="bg-gray-900 shadow text-white h-14 sticky w-full z-10 top-0" role="navigation">
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
      <div className='flex flex-row flex-1 w-full relative'>
        {shouldDisplayReflectionsList && (currentStep === 'actions' ?
          <ReflectionsListForActionStep
            open={reflectionsListVisible || revealer || profile?.facilitator}
            onToggle={handleReflectionsListToggle} /> :
          <ReflectionsList
            open={reflectionsListVisible || revealer}
            retrospectiveKind={kind}
            onToggle={handleReflectionsListToggle}
            onDone={handleReflectionsListClose} />
        )}
        <div className='flex flex-col flex-1'>
          <div className={classNames('bg-gray-200 shadow sticky w-full top-14 z-10 text-white duration-200 ease-linear transform transition-height h-24 origin-top overflow-hidden', { '!h-0': !participantsListVisible })}>
            <div className="mx-auto p-4 flex flex-wrap items-center md:flex-no-wrap">
              <div className='flex flex-grow justify-end'>
                {profile?.facilitator && <FacilitatorToolkitLeft />}
                <ParticipantsList onAddParticipantsClick={handleOpenAddParticipantsModal} />
                {profile?.facilitator && <FacilitatorToolkitRight />}
              </div>
            </div>
          </div>
          <div id='right-panel' className={classNames('flex flex-col flex-1 relative', { 'pushed-top': participantsListVisible, 'pushed-left': shouldDisplayReflectionsList && pushedLeft})}>
            {!loggedIn && <LoginForm retrospectiveId={retrospectiveId} invitation={invitation} />}
            {loggedIn && <RetrospectiveArea retrospectiveId={retrospectiveId} kind={kind} />}
          </div>
        </div>
      </div>
      {loggedIn && groupInfo && (
        <AddGroupMembersModal
          visible={displayAddParticipantsModal}
          onInvitationsSent={handleAddParticipantsModalClose}
          onModalClose={handleAddParticipantsModalClose}
          group={groupInfo}
          retrospectiveId={retrospectiveId}
          withGroupMembers
          withShareableLink />
      )}
    </div>
  )
}

RetrospectiveLobby.propTypes = {
  id: PropTypes.string.isRequired,
  invitation: PropTypes.object,
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
      <RetrospectiveLobby {...{ invitation: props.invitation, ...props.retrospective }} />
    </Provider>
  )
}

RetrospectiveLobbyWithProvider.propTypes = {
  initialState: PropTypes.object.isRequired,
  invitation: PropTypes.object,
  retrospective: PropTypes.object.isRequired
}

export default RetrospectiveLobbyWithProvider
