import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Tag from './Tag'

const DetailedTask = ({ task, showAssignee, additionalClassName }) => {
  const jsDate = new Date(task.createdAt)

  const content = task.retrospective.zonesTypology == 'single_choice' ? task.reflection.zone.name : task.reflection.content
  return (
    <div className={classNames('flex flex-col bg-gray-400 rounded-md p-2 m-2', additionalClassName)}>
      <div className='text-sm  border-b-2 border-gray-500'>
        <span>{showAssignee ? `Assigned to ${task.assignee.surname} on` : 'Since'}</span>
        <span> {('0' + jsDate.getDay()).slice(-2)}/{('0' + (jsDate.getMonth() + 1)).slice(-2)}</span>
      </div>
      <div className='bg-gray-200 rounded-md p-2 mt-2'>{content}</div>
      <div className='mt-1'>{task.description}</div>
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
      content: PropTypes.string.isRequired,
      zone: PropTypes.shape({
        name: PropTypes.string.isRequired
      })
    }),
    retrospective: PropTypes.shape({
      zonesTypology: PropTypes.string.isRequired
    }),
    status: PropTypes.string.isRequired
  }).isRequired,
  additionalClassName: PropTypes.string,
  showAssignee: PropTypes.bool
}

export default DetailedTask
