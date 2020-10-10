import React, { useState, useEffect } from 'react'
import { Provider } from 'react-redux'
import appStore from 'stores'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { get } from 'lib/httpClient'
import RetrospectivePage from './RetrospectivePage'
import AddGroupMembersModal from './AddGroupMembersModal'
import HomeIcon from 'images/home-icon.svg'
import ArrowIcon from 'images/arrow-icon.svg'

const RetrospectiveHeader = ({ groupName, kind, participantsListVisible, toggleParticipantsList }) => {
  return (
    <nav className="bg-gray-900 shadow text-white h-14 sticky w-full z-10 top-0" role="navigation">
      <div className="container mx-auto p-4 flex flex-wrap items-center md:flex-no-wrap">
        <div className="mr-4 md:mr-8">
          <a href='/'>
            <img src={HomeIcon} width="24" />
          </a>
        </div>
        <div className="mr-4 md:mr-8">
          Lobby {groupName} - {kind}
        </div>
        <div className='flex flex-grow justify-end'>
          <img className={classNames('cursor-pointer duration-200 ease-in-out transition-transform', { 'transform rotate-180': participantsListVisible })} src={ArrowIcon} width="24" onClick={toggleParticipantsList} />
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

const RetrospectiveContainer = ({ id }) => {
  const [store, setStore] = useState()
  const [retrospectiveInfo, setRetrospectiveInfo] = useState()

  const [participantsListVisible, setParticipantsListVisible] = useState(true)
  const [displayAddParticipantsModal, setDisplayAddParticipantsModal] = useState(false)

  useEffect(() => {
    get({ url: `/api/retrospectives/${id}` })
      .then(({ initialState, retrospective }) => {
        setRetrospectiveInfo(retrospective)
        setStore(appStore({ ...initialState, retrospective: retrospective }))
      })
      .catch(() => history.pushState(null, '', '/'))
  }, [id])

  return (
    <div id='main-container' className='flex flex-col min-h-screen'>
      <RetrospectiveHeader
        groupName={retrospectiveInfo?.group?.name}
        kind={retrospectiveInfo?.kind}
        participantsListVisible={participantsListVisible}
        toggleParticipantsList={() => setParticipantsListVisible(!participantsListVisible)} />
      {retrospectiveInfo && (
        <>
          {store && (
            <Provider store={store}>
              <RetrospectivePage
                {...retrospectiveInfo}
                participantsListVisible={participantsListVisible}
                handleOpenAddParticipantsModal={() => setDisplayAddParticipantsModal(true)} />
            </Provider>
          )}
          <GroupMembersModalWrapper
            groupId={retrospectiveInfo.group.id}
            retrospectiveId={id}
            setDisplayAddParticipantsModal={setDisplayAddParticipantsModal}
            visible={displayAddParticipantsModal} />
        </>
      )}
    </div>
  )
}

RetrospectiveContainer.propTypes = {
  id: PropTypes.string.isRequired
}

export default RetrospectiveContainer
