import React from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import { put } from 'lib/httpClient'
import Button from './Button'

const StepReview = () => {
  const tasks = useSelector(state => state.group.pendingTasks, shallowEqual)
  const [buttonStates, setButtonStates] = React.useState({})

  const resolveStatus = (event, status) => {
    const taskId = event.currentTarget.dataset.id
    put({
      url: `/api/tasks/${taskId}`,
      payload: { status }
    })
      .then(() => setButtonStates({ ...buttonStates, [taskId]: status }))
  }

  const handleDoneClicked = (event) => {
    resolveStatus(event, 'done')
  }

  const handleWontDoClicked = (event) => {
    resolveStatus(event, 'stuck')
  }

  const handleLaterClicked = (event) => {
    resolveStatus(event, 'todo')
  }

  return (
    <>
      Tasks review
      <div id='zones-container' className="flex flex-col">
        {tasks.filter((task) => task.status === 'todo').map((task) => (
          <div className='zone-column border flex-1 m-2 p-4 rounded first:ml-0 last:mr-0' key={task.id}>
            <div>Reflection: {task.reflection.content}</div>
            <div>Task: {task.description}</div>
            <div>Assigned to {task.assignee.surname}</div>

            <div>
              <Button contained primary selected={buttonStates[task.id] === 'done'} data-id={task.id} onClick={handleDoneClicked}>Done</Button>
              <Button contained primary selected={buttonStates[task.id] === 'stuck'} data-id={task.id} className='ml-4' onClick={handleWontDoClicked}>Won&apos;t do</Button>
              <Button contained primary selected={buttonStates[task.id] === 'todo'} data-id={task.id} className='ml-4' onClick={handleLaterClicked}>Ask again next retrospective</Button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default StepReview
