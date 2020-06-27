import React from 'react'
import { get } from 'lib/httpClient'
import PropTypes from 'prop-types'
import Button from './Button'
import { Link } from 'react-router-dom'

const GroupsDetails = ({ id }) => {
  const [group, setGroup] = React.useState(null)

  React.useEffect(() => {
    if (!id) return

    get({ url: `/api/groups/${id}` })
      .then((data) => setGroup(data))
  }, [id])

  return (
    <div className='container mx-auto flex flex-col'>
      <Link to='/groups'>
        <Button primary contained>Back</Button>
      </Link>

      {group && (
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

            <h2 className='mt-4 font-bold'>Tasks</h2>
            <div className='flex flex-row flex-wrap'>
              {group.pendingTasks.length === 0 && <span>No task</span>}
              {group.pendingTasks.map((task) => {
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
      )}
    </div>
  )
}

GroupsDetails.propTypes = {
  id: PropTypes.string.isRequired
}

export default GroupsDetails
