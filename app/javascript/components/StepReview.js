import React from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import { put } from 'lib/httpClient'
import Button from './Button'

const StepReview = () => {
  const tasks = useSelector(state => state.group.pendingTasks, shallowEqual)

  const resolveStatus = (event, status) => {
    const taskId = event.currentTarget.dataset.id
    put({
      url: `/api/tasks/${taskId}`,
      payload: { status }
    })
  }

  const handleDoneClicked = (event) => {
    resolveStatus(event, 'done')
  }

  const handleWontDoClicked = (event) => {
    resolveStatus(event, 'wont_do')
  }

  const handleToDoClicked = (event) => {
    resolveStatus(event, 'todo')
  }

  const handleLaterClicked = (event) => {
    resolveStatus(event, 'on_hold')
  }

  return (
    <>
      Tasks review
      <div id='tasks-container' className="flex flex-col">
        {tasks.map((task) => (
          <div data-id={task.id} className='task border flex-1 p-4 rounded my-2' key={task.id}>
            <div>Reflection: {task.reflection.content}</div>
            <div>Task: {task.description}</div>
            <div>Assigned to {task.assignee.surname}</div>

            <div>
              <Button contained primary name={'done'} selected={task.status === 'done'} data-id={task.id} onClick={handleDoneClicked}>Done</Button>
              <Button contained primary name={'wont_do'} selected={task.status === 'wont_do'} data-id={task.id} className='ml-4' onClick={handleWontDoClicked}>Won&apos;t do</Button>
              <Button contained primary name={'on_hold'} selected={task.status === 'on_hold'} data-id={task.id} className='ml-4' onClick={handleLaterClicked}>On hold</Button>
              <Button contained primary name={'todo'} selected={task.status === 'todo'} data-id={task.id} className='ml-4' onClick={handleToDoClicked}>To do for next time</Button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default StepReview
