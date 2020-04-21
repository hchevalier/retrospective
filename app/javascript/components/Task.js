import React from 'react'
import EditIcon from '@material-ui/icons/Edit'
import './Task.scss'

const Task = ({ task, onEdit }) => {
  return (
    <div id={task.id} className='task'>
      <b className='assignee'>
        Assigned to {task.assignee.surname}
        <EditIcon className='edit-icon' style={{ fontSize: 14 }} onClick={() => onEdit(task)} />
      </b><br />
      {task.description}
    </div>
  )
}

export default Task
