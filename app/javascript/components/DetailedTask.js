import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Tag from './Tag'

const DetailedTask = ({ task, showAssignee, additionalClassName }) => {
  const jsDate = new Date(task.createdAt)

  // TODO: handle trafficlight retro where reflection.content is a color
  return (
    <div className={classNames('flex flex-col bg-gray-400 rounded-md p-2 m-2', additionalClassName)}>
      <div className='text-sm  border-b-2 border-gray-500'>
        <span>{showAssignee ? `Assigned to ${task.assignee.surname} on` : 'Since'}</span>
        <span> {('0' + jsDate.getDay()).slice(-2)}/{('0' + (jsDate.getMonth() + 1)).slice(-2)}</span>
      </div>
      <div>For {task.reflection.content}</div>
      <div>Action: {task.description}</div>
      <div className='flex flex-grow items-end self-end'>
        <Tag content={task.status} />
      </div>
    </div>
  )
}


DetailedTask.propTypes = {
  task: PropTypes.shape({
    assignee: PropTypes.shape({
      surname: PropTypes.string.isRequired
    }),
    createdAt: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    reflection: PropTypes.shape({
      content: PropTypes.string.isRequired
    }),
    status: PropTypes.string.isRequired
  }).isRequired,
  additionalClassName: PropTypes.string,
  showAssignee: PropTypes.bool
}

export default DetailedTask
