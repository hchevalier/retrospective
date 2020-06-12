import React from 'react'
import PropTypes from 'prop-types'
import Header from './Header'

const Dashboard = ({retrospectives, tasks}) => {
  return (
    <div id='dashboard'>
      <Header />
      <div className='container' style={{ margin: '0 auto'}}>
        <div className='mx-auto mt-8'>
          <div className='flex items-stretch'>
            <span className='flex-1 text-2xl'>Dashboard</span>

            <a className='bg-blue-500 hover:bg-blue-700 text-white font-medium py-1 px-2 rounded focus:outline-none focus:shadow-outline' href='/retrospectives/new'>
              Create a retrospective
            </a>
          </div>

          <div className='flex flex-col my-8'>
            <div className='flex-1 text-xl'>My retrospectives</div>

            <div className='grid grid-cols-1 md:grid-cols-2'>
              {retrospectives.map((retrospective) => {
                return (
                  <a key={retrospective.id} className='block bg-gray-400 rounded-md p-2 m-2' href={`/retrospectives/${retrospective.id}`}>
                    <div>
                      {retrospective.name} - {retrospective.kind}<br />
                      {new Date(retrospective.createdAt).toLocaleString()}
                    </div>
                  </a>
                )
              })}
            </div>
          </div>

          <div className='flex flex-col my-8'>
            <div className='flex-1 text-xl'>My tasks</div>

            <div className='grid grid-cols-1 md:grid-cols-2'>
              {tasks.map((task) => {
                return (
                  <div key={task.id} className='block bg-gray-400 rounded-md p-2 m-2'>
                    <div className='flex items-stretch'>
                      <span className='flex-1'>{new Date(task.createdAt).toLocaleString()}</span>
                      <span className='flex-1 text-right'>{task.status}</span>
                    </div>
                    {task.description}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

Dashboard.propTypes = {
  retrospectives: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      kind: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired
    })
  ).isRequired,
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      reflection: PropTypes.shape({
        id: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired
      }),
      description: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired
    })
  ).isRequired
}

export default Dashboard
