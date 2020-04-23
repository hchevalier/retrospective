import React from 'react'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete';
import './Task.scss'

const Task = ({ task, onEdit, onDelete, readOnly }) => {
  return (
    <div id={task.id} className='task'>
      <b className='assignee'>
        Assigned to {task.assignee.surname}
        {!readOnly && <span>
          <EditIcon className='edit-icon' style={{ fontSize: 14 }} onClick={() => onEdit(task)} />
          <DeleteIcon className='delete-icon' style={{ fontSize: 14 }} onClick={() => onDelete(task)} />
        </span>}
      </b><br />
      {task.description}
    </div>
  )
}

export default Task
