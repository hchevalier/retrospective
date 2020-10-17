import React from 'react'
import EditIcon from 'images/edit-icon.svg'
import DeleteIcon from 'images/delete-icon.svg'

const Task = ({ task, onEdit, onDelete, readOnly }) => {
  return (
    <div id={task.id} className='bg-gray-100 rounded shadow'>
      <div className='px-6 py-4'>
        <div className='font-bold mb-2'>Assigned to {task.assignee.username}</div>
        <div className='description'>
          {task.description}
        </div>
      </div>
      {!readOnly && <div className='px-6 pb-4'>
        <span className='inline-block bg-gray-200 rounded-full px-3 py-1 mr-2'>
          <img src={EditIcon} className='edit-icon cursor-pointer' onClick={() => onEdit(task)} />
        </span>
        <span className='inline-block bg-gray-200 rounded-full px-3 py-1'>
          <img src={DeleteIcon} className='delete-icon cursor-pointer' onClick={() => onDelete(task)} />
        </span>
      </div>}
    </div>
  )
}

export default Task
