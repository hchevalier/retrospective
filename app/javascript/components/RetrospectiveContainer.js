import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { Provider, useSelector } from 'react-redux'
import appStore from 'stores'
import PropTypes from 'prop-types'
import { get } from 'lib/httpClient'
import { humanize } from 'lib/helpers/string'
import RetrospectivePage from './RetrospectivePage'
import AddGroupMembersModal from './AddGroupMembersModal'
import HomeIcon from 'images/home-icon.svg'
import ParticipantsList from './ParticipantsList'
import FacilitatorToolkitLeft from './FacilitatorToolkitLeft'
import FacilitatorToolkitRight from './FacilitatorToolkitRight'

const RetrospectiveHeader = ({ groupName, kind, handleOpenAddParticipantsModal }) => {
  const profile = useSelector(state => state.profile)

  return (
    <nav className="bg-gray-900 shadow text-white h-14 sticky w-full z-10 top-0" role="navigation">
      <div className="container mx-auto px-4 py-1 flex flex-wrap items-center md:flex-no-wrap">
        <div className="mr-4 md:mr-8">
          <a href='/'>
            <img src={HomeIcon} width="24" />
          </a>
        </div>
        <div className="mr-4 md:mr-8">
          Lobby {groupName} - {kind ? humanize(kind) : ''}
        </div>
        <div className='flex flex-grow justify-end'>
          {profile?.facilitator && <FacilitatorToolkitLeft />}
          <ParticipantsList onAddParticipantsClick={handleOpenAddParticipantsModal} />
          {profile?.facilitator && <FacilitatorToolkitRight />}
        </div>
      </div>
    </nav >
  )
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
  }, [id])

  return (
    <div id='main-container' className='flex flex-col min-h-screen bg-white'>
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
  id: PropTypes.string.isRequired
}

export default withRouter(RetrospectiveContainer)
