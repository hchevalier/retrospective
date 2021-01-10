import React from 'react'
import { withRouter } from 'react-router-dom'
import { get, put, destroy } from 'lib/httpClient'
import { historyShape } from 'lib/utils/shapes'
import Card from './Card'
import { GroupAccessListItem, PendingInvitationListItem } from './GroupListItem'

const GroupList = ({ history }) => {
  const [groupAccesses, setGroupAccesses] = React.useState([])
  const [pendingInvitations, setPendingInvitations] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [currentAccount, setCurrentAccount] = React.useState()

  React.useEffect(() => {
    Promise.all([
      get({ url: '/api/group_accesses' }),
      get({ url: '/api/pending_invitations' }),
    ]).then(([groupAccessesData, pendingInvitationsData]) => {
      setGroupAccesses(groupAccessesData)
      setPendingInvitations(pendingInvitationsData)
      setLoading(false)
    })
  }, [])

  React.useEffect(() => {
    get({ url: '/api/account' })
      .then((account) => setCurrentAccount(account))
  }, [])

  const handleJoinGroup = (pendingInvitationToAccept) => {
    if (confirm(`Are you sure you want to join the group ${pendingInvitationToAccept.group.name}?`)) {
      put({
        url: `/api/pending_invitations/${pendingInvitationToAccept.id}`
      })
      .then(() => {
        setPendingInvitations(
          pendingInvitations.filter((pendingInvitation) => pendingInvitation.id !== pendingInvitationToAccept.id)
        )
        setGroupAccesses(prevState => [...prevState, pendingInvitationToAccept])
      })
    }
  }

  const handleLeaveGroup = (groupAccessToRevoke) => {
    if (confirm(`Are you sure you want to leave the group ${groupAccessToRevoke.group.name}?`)) {
      destroy({
        url: `/api/groups/${groupAccessToRevoke.group.id}/accounts/${currentAccount.publicId}`
      })
      .then(() => setGroupAccesses(groupAccesses.filter((groupAccess) => groupAccess.id !== groupAccessToRevoke.id)))
    }
  }

  const handleCreateGroup = () => history.push('/groups/new')

  return (
    <div className='mx-auto p-8 bg-gray-300 flex w-full'>
      <div className='flex flex-col w-full'>
        <Card title='My groups' wrap actionLocation='header' actionLabel='CREATE A GROUP' onAction={handleCreateGroup}>
          <div className='flex flex-row flex-wrap'>
            {pendingInvitations && pendingInvitations.map((pendingInvitation) => (
              <PendingInvitationListItem key={pendingInvitation.id} pendingInvitation={pendingInvitation} currentAccount={currentAccount} handleJoinGroup={handleJoinGroup} />
            ))}
            {groupAccesses && groupAccesses.map((groupAccess) => (
              <GroupAccessListItem key={groupAccess.id} groupAccess={groupAccess} currentAccount={currentAccount} handleLeaveGroup={handleLeaveGroup} />
            ))}
            {!loading && !groupAccesses && <span>You did not join nor create any group</span>}
          </div>
        </Card>
      </div>
    </div>
  )
}

GroupList.propTypes = {
  history: historyShape
}

export default withRouter(GroupList)
