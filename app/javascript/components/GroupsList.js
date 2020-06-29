import React from 'react'
import { Link } from 'react-router-dom'
import { get, destroy } from 'lib/httpClient'
import Button from './Button'

const GroupsList = () => {
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

  return (
    <div className='container mx-auto p-4 flex flex-wrap items-center md:flex-no-wrap'>
      <div className='flex flex-col my-8'>
        <Link to='/groups/new'>
          <Button primary contained>Create a group</Button>
        </Link>
        <div className='flex-1 text-xl mt-4'>My groups</div>
        <div>
          {groupAccesses && groupAccesses.map((groupAccess) => {
            const { group } = groupAccess

            return (
              <Link key={groupAccess.id} to={`/groups/${group.id}`}>
                <div className='rounded cursor-pointer bg-gray-400 p-2 mb-4'>
                  <div className='flex flex-row justify-between'>
                    <div className='flex flex-col justify-between'>
                      <div className='font-bold'>
                        <span>{group.name}</span>
                        &nbsp;<span>({group.membersCount} members)</span>
                      </div>
                      <div>Joined on {new Date(groupAccess.createdAt).toLocaleString()}</div>
                    </div>
                    <div className='flex flex-row border rounded self-start p-1 ml-2 hover:bg-gray-500'>
                      <div className='leave-link' onClick={(event) => { event.preventDefault(); handleLeaveGroup(groupAccess) }}>Leave group</div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
          {!loading && !groupAccesses && <span>You did not join nor create any group</span>}
        </div>
      </div>
    </div>
  )
}

export default GroupsList
