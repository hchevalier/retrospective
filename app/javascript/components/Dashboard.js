import React from 'react'
import { withRouter } from 'react-router-dom'
import { get } from 'lib/httpClient'
import { historyShape } from 'lib/utils/shapes'
import { formatTime, formatDateWithoutYear } from 'lib/helpers/date'
import { humanize } from 'lib/helpers/string'
import DetailedTask from './DetailedTask'
import Card from './Card'

const Dashboard = ({ history }) => {
  const [retrospectives, setRetrospectives] = React.useState([])
  const [tasks, setTasks] = React.useState([])
  const [groups, setGroups] = React.useState([])
  const [seeAllRetrospectives, setSeeAllRetrospectives] = React.useState(false)

  React.useEffect(() => {
    get({ url: '/api/retrospectives' })
      .then((data) => setRetrospectives(data))
      .catch(() => window.location.href = '/sessions/new')
  }, [])

  React.useEffect(() => {
    get({ url: '/api/tasks' })
      .then((data) => setTasks(data))
  }, [])

  React.useEffect(() => {
    get({ url: '/api/groups' })
      .then((data) => setGroups(data))
  }, [])

  const handleStartRetrospective = () => history.push('/retrospectives/new')

  const handleRetrospectiveClick = (retrospectiveId) => history.push(`/retrospectives/${retrospectiveId}`)

  const handleMoreRetrospectives = () => { setSeeAllRetrospectives(true) }

  const now = new Date()
  const currentRetrospective = retrospectives.find((retrospective) => {
    return new Date(retrospective.createdAt) > new Date(now - (3600000 * 1.5)) && retrospective.step !== 'done'
  })
  const groupsWithScheduledRetrospectives = groups.filter((group) => group.nextRetrospective)

  return (
    <div className='p-8 bg-gray-300'>
      <div className='flex flex-row'>
        <div className='flex w-3/4 flex-col'>
          {currentRetrospective && (
            <Card title='Current retrospective' actionLabel='JOIN' onAction={() => handleRetrospectiveClick(currentRetrospective.id)}>
              <span>A {humanize(currentRetrospective.kind)} retrospective was started</span>
              &nbsp;with&nbsp;
              <span>{currentRetrospective.group.name}</span>
              &nbsp;at&nbsp;
              <span>{new Date(currentRetrospective.createdAt).toLocaleTimeString().slice(0, 5)}</span>
            </Card>
          )}

          <Card title='My actions' wrap>
            {tasks.map((task) => <DetailedTask key={task.id} task={task} containerClassName='flex-1-50' />)}
            {tasks.length === 0 && <span className='text-gray-500'>No pending action</span>}
          </Card>
        </div>
        <div className='flex w-1/4 flex-col'>
          <Card title='New retrospective' vertical empty actionLabel='START' onAction={handleStartRetrospective} />

          <Card title='Scheduled retrospectives' vertical>
            {groupsWithScheduledRetrospectives.map((group) => (
              <div key={group.id}>
                <span className='font-medium text-blue-800'>{formatDateWithoutYear(new Date(group.nextRetrospective))}</span>
                <span>&nbsp;at</span>
                <span className='font-medium text-blue-800'>&nbsp;{formatTime(new Date(group.nextRetrospective))}</span>
                <span>&nbsp;with {group.name}</span>
              </div>
            ))}
            {groupsWithScheduledRetrospectives.length === 0 && <span className='text-gray-500'>No scheduled retrospective</span>}
          </Card>

          <Card title='History' vertical actionLabel='SEE ALL' onAction={handleMoreRetrospectives}>
            {retrospectives.slice(0, seeAllRetrospectives ? retrospectives.length : 3).map((retrospective) => {
              return (
                <div key={retrospective.id} className='cursor-pointer border-b w-full py-2' onClick={() => handleRetrospectiveClick(retrospective.id)}>
                  <div>
                    <span className='font-medium text-blue-800'>{formatDateWithoutYear(new Date(retrospective.createdAt))}</span>
                    <span>&nbsp;{humanize(retrospective.kind)} with {retrospective.group.name}</span>
                  </div>
                </div>
              )
            })}
            {retrospectives.length === 0 && <span className='text-gray-500'>No past retrospective</span>}
          </Card>
        </div>
      </div>
    </div>
  )
}

Dashboard.propTypes = {
  history: historyShape
}

export default withRouter(Dashboard)
