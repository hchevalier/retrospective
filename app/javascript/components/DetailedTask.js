import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { formatDateWithoutYear } from 'lib/helpers/date'
import Tag from './Tag'

const DetailedTask = ({ task, showAssignee, additionalClassName, containerClassName }) => {
  const jsDate = new Date(task.createdAt)

  const content = task.retrospective.zonesTypology == 'single_choice' ? task.reflection.zone.name : task.reflection.content
  return (
    <div className={classNames('p2', containerClassName)}>
      <div className={classNames('flex flex-col bg-gray-200 rounded-md p-2 m-2', additionalClassName)}>
        <div className='text-sm border-b-2 border-gray-400'>
          <span>{showAssignee ? `Assigned to ${task.assignee.surname} on` : 'Since'}</span>
          <span> {formatDateWithoutYear(jsDate)}</span>
        </div>
        <div className='bg-gray-100 rounded-md p-2 mt-2'>{content}</div>
        <div className='mt-1'>{task.description}</div>
        <div className='flex flex-grow items-end self-end'>
          <Tag content={task.status} />
        </div>
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
  containerClassName: PropTypes.string,
  showAssignee: PropTypes.bool
}

export default DetailedTask
