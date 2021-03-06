import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { get, put, destroy } from 'lib/httpClient'
import DateTimePicker from 'react-datetime-picker'
import AddGroupMembersModal from './AddGroupMembersModal'
import Card from './Card'
import Button from './Button'
import DetailedTask from './DetailedTask'

const GroupsDetails = ({ id }) => {
  const [groupRefresh, setGroupRefresh] = React.useState(1)
  const [group, setGroup] = React.useState({ members: [], tasks: [], pendingInvitations: [] })
  const [addMembersModalVisible, setAddMembersModalVisible] = React.useState(false)
  const [displayDoneTasks, setDisplayDoneTasks] = React.useState(false)
  const [nextRetrospective, setNextRetrospective] = React.useState()
  const [currentAccount, setCurrentAccount] = React.useState()

  const handleAddGroupMembersClick = () => setAddMembersModalVisible(true)
  const handleAddGroupMembersModalClose = () => setAddMembersModalVisible(false)
  const handleToggleDisplayDoneTasks = () => setDisplayDoneTasks(!displayDoneTasks)
  const refreshGroup = () => setGroupRefresh(groupRefresh + 1)

  const handleCancelInvitation = (event) => {
    destroy({
      url: `/api/groups/${group.id}/pending_invitations/${event.currentTarget.dataset.id}`
    })
      .then(refreshGroup)
      .catch(error => console.warn(error))
  }

  const handleSendInvitation = () => {
    setAddMembersModalVisible(false)
    refreshGroup()
  }

  const handleNextRetrospectiveChanged = (date) => {
    setNextRetrospective(date)
    put({ url: `/api/groups/${id}`, payload: { next_retrospective: date } })
  }

  const revokeAccessFromGroup = (account) => {
    if (confirm(`Are you sure you want to remove ${account.username} from the group ${group.name}?`)) {
      destroy({
        url: `/api/groups/${group.id}/accounts/${account.publicId}`
      }).then(() => {
        refreshGroup()
      })
    }
  }

  const filteredTasks = group.tasks.filter((task) => displayDoneTasks || ['todo', 'on_hold'].includes(task.status))

  React.useEffect(() => {
    if (!id) return

    get({ url: `/api/groups/${id}` })
      .then((data) => {
        setGroup(data)
        if (!nextRetrospective && data.nextRetrospective) setNextRetrospective(new Date(data.nextRetrospective))
      })
  }, [id, groupRefresh, nextRetrospective])

  React.useEffect(() => {
    get({ url: '/api/account' }).then((account) => setCurrentAccount(account))
  }, [])

  return (
    <div className='mx-auto flex flex-col p-8 bg-gray-300'>
      <div className='flex flex-row flex-grow justify-between'>
        <Link to='/groups'>
          <Button primary contained>Back</Button>
        </Link>
      </div>

      {group.members.length > 0 && (
        <div className='flex flex-row mt-8'>
          <div className='flex w-3/4 flex-col'>
            {group.pendingInvitations.length > 0 && (
              <Card title={`Pending invitations (${group.pendingInvitations.length})`} wrap containerClassName='mb-6'>
                <div className='flex flex-col flex-wrap'>
                  <ul>
                    {group.pendingInvitations.map((invitation) => {
                      return (
                        <li key={invitation.id}>
                          {invitation.email}&nbsp;
                          <span className='text-xs'>
                            (<a data-id={invitation.id} className='cursor-pointer' onClick={handleCancelInvitation}>Cancel invitation</a>)
                            </span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </Card>
            )}

            <Card
              title={`Actions (${filteredTasks.length})`}
              wrap
              actionLabel={displayDoneTasks ? 'HIDE DONE' : 'SEE DONE'}
              actionLocation='header'
              onAction={handleToggleDisplayDoneTasks}>
              {filteredTasks.length === 0 && <span className='text-gray-500'>No action</span>}
              {filteredTasks.map((task) => <DetailedTask key={task.id} task={task} showAssignee containerClassName={'flex-1-33'} />)}
            </Card>
          </div>

          <div className='flex w-1/4 flex-col'>
            <Card title={group.name} wrap containerClassName='mb-6'>
              <div>Created on {new Date(group.createdAt).toLocaleDateString()}</div>
              <div>
                <div>Next retrospective:</div>
                <DateTimePicker onChange={handleNextRetrospectiveChanged} closeWidgets showLeadingZeros disableClock locale='fr-FR' value={nextRetrospective} />
              </div>
            </Card>

            <Card title={`Group members (${group.members.length})`} wrap actionLocation='header' actionLabel='ADD' onAction={handleAddGroupMembersClick}>
              <div className='flex flex-col flex-wrap w-full p-2'>
                {currentAccount && (
                  <ul>
                    {group.members.map((account) => {
                      return (
                        <li key={account.publicId} className='member-group flex justify-between'>
                          {account.username}
                          {currentAccount.publicId !== account.publicId && (
                            <button
                              className='bg-red-200 text-red-700 text-xxs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 rounded-full'
                              onClick={(event) => { event.preventDefault(); revokeAccessFromGroup(account) }}>
                              REMOVE
                            </button>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            </Card>
          </div>

          <AddGroupMembersModal
            visible={addMembersModalVisible}
            onInvitationsSent={handleSendInvitation}
            onModalClose={handleAddGroupMembersModalClose}
            group={group} />
        </div>
      )}
    </div>
  )
}

GroupsDetails.propTypes = {
  id: PropTypes.string.isRequired
}

export default GroupsDetails
