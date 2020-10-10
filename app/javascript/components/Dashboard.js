import React from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { get } from 'lib/httpClient'

const Dashboard = ({ history }) => {
  const [retrospectives, setRetrospectives] = React.useState([])
  const [tasks, setTasks] = React.useState([])

  React.useEffect(() => {
    get({ url: '/api/retrospectives' })
      .then((data) => setRetrospectives(data))
      .catch(() => window.location.href = '/sessions/new')
  }, [])

  React.useEffect(() => {
    get({ url: '/api/tasks' })
      .then((data) => setTasks(data))
  }, [])

  const handleRetrospectiveClick = (retrospectiveId) => history.push(`/retrospectives/${retrospectiveId}`)

  return (
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
            {retrospectives && retrospectives.map((retrospective) => {
              return (
                <div key={retrospective.id} className='block bg-gray-400 rounded-md p-2 m-2 cursor-pointer' onClick={() => handleRetrospectiveClick(retrospective.id)}>
                  {retrospective.group.name} - {retrospective.kind}<br />
                  {new Date(retrospective.createdAt).toLocaleString()}
                </div>
              )
            })}
          </div>
        </div>

        <div className='flex flex-col my-8'>
          <div className='flex-1 text-xl'>My tasks</div>

          <div className='grid grid-cols-1 md:grid-cols-2'>
            {tasks && tasks.map((task) => {
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
  )
}

Dashboard.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  })
}

export default withRouter(Dashboard)
