import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { get, destroy } from 'lib/httpClient'
import { historyShape } from 'lib/utils/shapes'
import Card from './Card'

const GroupsList = ({ history }) => {
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
            {groupAccesses && groupAccesses.map((groupAccess) => {
              const { group } = groupAccess

              return (
                <Link key={groupAccess.id} to={`/groups/${group.id}`}>
                  <div className='p2 w-64'>
                    <div className='flex flex-col bg-gray-200 rounded-md p-2 m-2'>
                      <div className='border-b-2 border-gray-400'>
                        <span className='font-bold text-blue-800'>{group.name}</span>
                      </div>

                      <div className='mt-1 text-sm'>{group.membersCount} members</div>
                      <div className='mt-2 text-sm'>Created on {new Date(group.createdAt).toLocaleDateString()}</div>
                      <div className='mt-1 text-sm'>Joined on {new Date(groupAccess.createdAt).toLocaleDateString()}</div>
                      <div className='mt-2 text-sm'>{group.pendingTasksCount} actions pending</div>
                      <div className='mt-1 text-sm'>{group.allTimeRetrospectivesCount} retrospectives since creation</div>

                      <div className='flex flex-grow mt-4 items-end self-end'>
                        <button
                          className='bg-red-200 text-red-700 text-xxs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 rounded-full'
                          onClick={(event) => { event.preventDefault(); handleLeaveGroup(groupAccess) }}>
                          LEAVE
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
            {!loading && !groupAccesses && <span>You did not join nor create any group</span>}
          </div>
        </Card>
      </div>
    </div>
  )
}

GroupsList.propTypes = {
  history: historyShape
}

export default withRouter(GroupsList)
