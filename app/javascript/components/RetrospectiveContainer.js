import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { Provider, useSelector } from 'react-redux'
import appStore from 'stores'
import PropTypes from 'prop-types'
import { get } from 'lib/httpClient'
import { RETROSPECTIVE_NAMES } from 'lib/utils/displayNames'
import RetrospectivePage from './RetrospectivePage'
import AddGroupMembersModal from './AddGroupMembersModal'
import HomeIcon from 'images/home-icon.svg'
import ParticipantsList from './ParticipantsList'
import FacilitatorToolkitLeft from './FacilitatorToolkitLeft'
import FacilitatorToolkitRight from './FacilitatorToolkitRight'
import { historyShape } from '../lib/utils/shapes'

const RetrospectiveHeader = ({ groupName, kind, handleOpenAddParticipantsModal }) => {
  const profile = useSelector(state => state.profile)

  return (
    <div className='block bg-white border-b border-gray-400 sticky z-50 top-0'>
      <div className='container mx-auto px-4'>
        <div className='flex'>
          <div className='flex -mb-px mr-8 items-center opacity-50 text-grey-700 border-transparent hover:opacity-75 hover:border-grey-700'>
            <a href='/'>
              <img src={HomeIcon} width="24" />
            </a>
          </div>
          <div className='flex -mb-px mr-8 items-center no-underline flex items-center py-4 border-b text-blue-700 border-blue-700'>
            Lobby {groupName} - {kind ? RETROSPECTIVE_NAMES[kind] : ''}
          </div>
          <div className='flex -mb-px flex-grow justify-end text-right items-center'>
            {profile?.facilitator && <FacilitatorToolkitLeft />}
            <ParticipantsList onAddParticipantsClick={handleOpenAddParticipantsModal} />
            {profile?.facilitator && <FacilitatorToolkitRight />}
          </div>
        </div>
      </div>
    </div>
  )
}

RetrospectiveHeader.propTypes = {
  groupName: PropTypes.string.isRequired,
  handleOpenAddParticipantsModal: PropTypes.func.isRequired,
  kind: PropTypes.string.isRequired
}

const GroupMembersModalWrapper = ({ groupId, retrospectiveId, setDisplayAddParticipantsModal, visible }) => {
  const [groupInfo, setGroupInfo] = useState(null)
  const handleAddParticipantsModalClose = () => setDisplayAddParticipantsModal(false)

  React.useEffect(() => {
    if (!groupId) return

    get({ url: `/api/groups/${groupId}` })
      .then((data) => setGroupInfo(data))
  }, [groupId])

  if (!groupInfo) return null

  return (
    <AddGroupMembersModal
      visible={visible}
      onInvitationsSent={handleAddParticipantsModalClose}
      onModalClose={handleAddParticipantsModalClose}
      group={groupInfo}
      retrospectiveId={retrospectiveId}
      withGroupMembers
      withShareableLink />
  )
}

GroupMembersModalWrapper.propTypes = {
  groupId: PropTypes.string.isRequired,
  retrospectiveId: PropTypes.string.isRequired,
  setDisplayAddParticipantsModal: PropTypes.func.isRequired,
  visible: PropTypes.bool
}

const RetrospectiveContainer = ({ id, history }) => {
  const [store, setStore] = useState()
  const [retrospectiveInfo, setRetrospectiveInfo] = useState()
  const [displayAddParticipantsModal, setDisplayAddParticipantsModal] = useState(false)

  useEffect(() => {
    get({ url: `/api/retrospectives/${id}` })
      .then(({ initialState, retrospective }) => {
        setRetrospectiveInfo(retrospective)
        setStore(appStore({ ...initialState, retrospective: retrospective }))
      })
      .catch(() => history.push('/'))
  }, [id, history])

  return (
    <div id='main-container' className='flex flex-col min-h-screen bg-gray-300'>
      {retrospectiveInfo && store && (
        <Provider store={store}>
          <RetrospectiveHeader
            groupName={retrospectiveInfo.group.name}
            kind={retrospectiveInfo.kind}
            handleOpenAddParticipantsModal={() => setDisplayAddParticipantsModal(true)} />

          <RetrospectivePage {...retrospectiveInfo} />

          <GroupMembersModalWrapper
            groupId={retrospectiveInfo.group.id}
            retrospectiveId={id}
            setDisplayAddParticipantsModal={setDisplayAddParticipantsModal}
            visible={displayAddParticipantsModal} />
        </Provider>
      )}
    </div>
  )
}

RetrospectiveContainer.propTypes = {
  history: historyShape,
  id: PropTypes.string.isRequired
}

export default withRouter(RetrospectiveContainer)
