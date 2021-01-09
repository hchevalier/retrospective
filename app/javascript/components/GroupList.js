import React from 'react'
import { withRouter } from 'react-router-dom'
import { get, destroy } from 'lib/httpClient'
import { historyShape } from 'lib/utils/shapes'
import Card from './Card'
import GroupListItem from './GroupListItem'

const GroupList = ({ history }) => {
  const [groupAccesses, setGroupAccesses] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [currentAccount, setCurrentAccount] = React.useState()

  React.useEffect(() => {
    get({ url: '/api/group_accesses' })
      .then((data) => { setGroupAccesses(data); setLoading(false)})
  }, [])

  React.useEffect(() => {
    get({ url: '/api/account' })
      .then((account) => setCurrentAccount(account))
  }, [])

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
            {groupAccesses && groupAccesses.map((groupAccess) => (
              <GroupListItem groupAccess={groupAccess} currentAccount={currentAccount} handleLeaveGroup={handleLeaveGroup} />
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
