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
      <div id='tasks-container' className="flex flex-col">
        {tasks.filter((task) => task.status === 'todo').map((task) => (
          <div data-id={task.id} className='task border flex-1 p-4 rounded my-2' key={task.id}>
            <div>Reflection: {task.reflection.content}</div>
            <div>Task: {task.description}</div>
            <div>Assigned to {task.assignee.surname}</div>

            <div>
              <Button contained primary selected={buttonStates[task.id] === 'done'} data-id={task.id} onClick={handleDoneClicked}>Done</Button>
              <Button contained primary selected={buttonStates[task.id] === 'stuck'} data-id={task.id} className='ml-4' onClick={handleWontDoClicked}>Won&apos;t do</Button>
              <Button contained primary selected={buttonStates[task.id] === 'todo'} data-id={task.id} className='ml-4' onClick={handleLaterClicked}>Ask next time</Button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default StepReview
