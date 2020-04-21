import React, { useState } from 'react'

const Task = ({ task, onEdit }) => {
  return (
    <div className='task'>
      <b>Assigned to {task.assignee.surname}</b><br />
      {task.description}
      <div onClick={() => onEdit(task)}>Edit</div>
    </div>
  )
}

export default Task
