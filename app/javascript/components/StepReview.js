import React, { useState } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import { get } from 'lib/httpClient'
import Card from './Card'
import DetailedTask from './DetailedTask'

const StepReview = () => {
  const tasks = useSelector(state => state.group.pendingTasks, shallowEqual)
  const groupId = useSelector(state => state.retrospective.group.id)
  const [members, setMembers] = useState([])

  React.useEffect(() => {
    get({ url: `/api/groups/${groupId}` })
      .then((data) => {
        setMembers(data.members)
      })
  }, [groupId])

  return (
    <Card className='task border flex-1 p-4 rounded my-2' wrap>
      {tasks.map((task) => (
        <div key={task.id} className='flex flex-col flex-1-50'>
          <DetailedTask task={task} showAssignee editable availableAssignees={members} />
        </div>
      ))}
    </Card>
  )
}

export default StepReview
