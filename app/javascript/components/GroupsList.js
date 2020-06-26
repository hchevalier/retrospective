import React from 'react'
import { Link } from 'react-router-dom'
import { get } from 'lib/httpClient'
import Button from './Button'

const GroupsList = () => {
  const [groups, setGroups] = React.useState([])

  React.useEffect(() => {
    get({ url: '/api/groups' })
      .then((data) => setGroups(data))
  }, [])

  return (
    <div className='container mx-auto p-4 flex flex-wrap items-center md:flex-no-wrap'>

      <div className='flex flex-col my-8'>
        <Link to='/groups/new'>
          <Button primary contained>Create a group</Button>
        </Link>
        <div className='flex-1 text-xl'>My groups</div>
        <div>
          {groups && groups.map((group) => {
            return (
              <div key={group.id}>
                <div>{group.name}</div>
                <div className='flex flex-row flex-wrap'>
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
            )
          })}
        </div>
      </div>
    </div>
  )
  }

export default GroupsList
