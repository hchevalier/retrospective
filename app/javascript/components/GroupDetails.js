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

  const filteredTasks = group.tasks.filter((task) => displayDoneTasks || ['todo', 'on_hold'].includes(task.status))

  React.useEffect(() => {
    if (!id) return

    get({ url: `/api/groups/${id}` })
      .then((data) => {
        setGroup(data)
        if (!nextRetrospective && data.nextRetrospective) setNextRetrospective(new Date(data.nextRetrospective))
      })
  }, [id])

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
              <Card title={`Pending invitations (${group.pendingInvitations.length})`} wrap>
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
              title={`Tasks (${filteredTasks.length})`}
              wrap
              actionLabel={displayDoneTasks ? 'HIDE DONE' : 'SEE DONE'}
              actionLocation='header'
              onAction={handleToggleDisplayDoneTasks}>
              {filteredTasks.length === 0 && <span>No task</span>}
              {filteredTasks.map((task) => <DetailedTask key={task.id} task={task} showAssignee containerClassName={'flex-1-33'} />)}
            </Card>
          </div>

          <div className='flex w-1/4 flex-col'>
            <Card title={group.name} wrap>
              <div>Created on {new Date(group.createdAt).toLocaleDateString()}</div>
              <div>
                <div>Next retrospective:</div>
                <DateTimePicker onChange={handleNextRetrospectiveChanged} closeWidgets disableClock value={nextRetrospective} />
              </div>
            </Card>

            <Card title={`Group members (${group.members.length})`} wrap actionLocation='header' actionLabel='ADD' onAction={handleAddGroupMembersClick}>
              <div className='flex flex-col flex-wrap'>
                <ul>
                  {group.members.map((account) => {
                    return <li key={account.id}>{account.username}</li>
                  })}
                </ul>
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
