import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { get, destroy } from 'lib/httpClient'
import { historyShape } from 'lib/utils/shapes'
import Card from './Card'

const GroupsList = ({ history }) => {
  const [groupAccesses, setGroupAccesses] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    get({ url: '/api/group_accesses' })
      .then((data) => { setGroupAccesses(data); setLoading(false)})
  }, [])

  const handleLeaveGroup = (groupAccessToRevoke) => {
    if (confirm(`Leave ${groupAccessToRevoke.group.name}`)) {
      destroy({ url: `/api/group_accesses/${groupAccessToRevoke.id}` })
        .then(() => setGroupAccesses(groupAccesses.filter((groupAccess) => groupAccess.id !== groupAccessToRevoke.id)))
    }
  }

  const handleCreateGroup = () => history.push('/groups/new')

  return (
    <div className='mx-auto p-8 bg-gray-300 flex w-full'>
      <div className='flex flex-col w-full'>
        <Card title='My groups' wrap actionLocation='header' actionLabel='CREATE A GROUP' onAction={handleCreateGroup}>
          <div>
            {groupAccesses && groupAccesses.map((groupAccess) => {
              const { group } = groupAccess

              return (
                <Link key={groupAccess.id} to={`/groups/${group.id}`}>
                  <div className='p2'>
                    <div className='flex flex-col bg-gray-200 rounded-md p-2 m-2'>
                      <div className='text-sm border-b-2 border-gray-400'>
                        <span className='text-blue-800'>{group.name}</span>
                        <span> joined on {new Date(groupAccess.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className='mt-1'>{group.membersCount} members</div>
                      <div className='flex flex-grow items-end self-end'>
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
