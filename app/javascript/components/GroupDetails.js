import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { get, destroy } from 'lib/httpClient'
import AddGroupMembersModal from './AddGroupMembersModal'
import Button from './Button'

const GroupsDetails = ({ id }) => {
  const [groupRefresh, setGroupRefresh] = React.useState(1)
  const [group, setGroup] = React.useState({ members: [], pendingInvitations: [] })
  const [addMembersModalVisible, setAddMembersModalVisible] = React.useState(false)

  const handleAddGroupMembersClick = () => setAddMembersModalVisible(true)
  const handleAddGroupMembersModalClose = () => setAddMembersModalVisible(false)
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

  React.useEffect(() => {
    if (!id) return

    get({ url: `/api/groups/${id}` })
      .then((data) => setGroup(data))
  }, [id, groupRefresh])

  return (
    <div className='container mx-auto flex flex-col'>
      <div className='flex flex-row flex-grow justify-between'>
        <Link to='/groups'>
          <Button primary contained>Back</Button>
        </Link>
        <Button primary contained onClick={handleAddGroupMembersClick}>Add members</Button>
      </div>

      {group.members.length && (
        <>
          <div className='flex flex-col my-8'>
            <div className='flex-1 text-xl font-bold'>Group {group.name}</div>
            <div>
              Created on {group.createdAt}
            </div>

            <div>
              <h2 className='mt-4 font-bold'>Group members: {group.members.length}</h2>
              <div className='flex flex-col flex-wrap ml-8'>
                <ul className='list-disc'>
                  {group.members.map((account) => {
                    return <li key={account.id}>{account.username}</li>
                  })}
                </ul>
              </div>

              {group.pendingInvitations.length > 0 && (
                <>
                  <h2 className='mt-4 font-bold'>Pending invitations:</h2>
                  <div className='flex flex-col flex-wrap ml-8'>
                    <ul className='list-disc'>
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
                </>
              )}

              <h2 className='mt-4 font-bold'>Tasks</h2>
              <div className='flex flex-row flex-wrap'>
                {group.tasks.length === 0 && <span>No task</span>}
                {group.tasks.map((task) => {
                  return (
                    <div key={task.id} className='block bg-gray-400 rounded-md p-2 m-2 w-64'>
                      <div className='flex items-stretch'>
                        <span className='flex-2'>{new Date(task.createdAt).toLocaleString()}</span>
                        <span className='flex-1 text-right'>{task.status}</span>
                      </div>
                      {task.description}
                      <div className='flex items-stretch'>
                        <span className='flex-1'>Assigned to {task.assignee.surname}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          <AddGroupMembersModal
            visible={addMembersModalVisible}
            onInvitationsSent={handleSendInvitation}
            onModalClose={handleAddGroupMembersModalClose}
            group={group} />
        </>
      )}
    </div>
  )
}

GroupsDetails.propTypes = {
  id: PropTypes.string.isRequired
}

export default GroupsDetails
