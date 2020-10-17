import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { put } from 'lib/httpClient'
import { formatDateWithoutYear } from 'lib/helpers/date'
import DropDown from './DropDown'
import Tag from './Tag'

const DetailedTask = ({ task, showAssignee, editable, availableAssignees, additionalClassName, containerClassName }) => {
  const jsDate = new Date(task.createdAt)

  const handleChangeStatus = (newStatus) => {
    put({
      url: `/api/tasks/${task.id}`,
      payload: { status: newStatus }
    })
  }

  const handleReassign = (newAssigneeId) => {
    put({
      url: `/api/tasks/${task.id}`,
      payload: { assignee_id: newAssigneeId }
    })
  }

  const content = task.retrospective.zonesTypology == 'single_choice' ? task.reflection.zone.name : task.reflection.content
  const assigneesOptions = (availableAssignees || []).map((account) => ({ label: account.username, value: account.publicId }))

  return (
    <div className={classNames('p2', containerClassName)}>
      <div className={classNames('flex flex-col bg-gray-200 rounded-md p-2 m-2', additionalClassName)}>
        <div className='text-sm border-b-2 border-gray-400'>
          {showAssignee && editable && (
            <span>Assigned to <DropDown inline disableAutocomplete options={assigneesOptions} small initialValue={task.assignee.publicId} onItemSelected={handleReassign} /> on</span>
          )}
          {showAssignee && !editable && (
            <span>Assigned to {task.assignee.username} on</span>
          )}
          {!showAssignee && <span>Since</span>}
          <span> {formatDateWithoutYear(jsDate)}</span>
        </div>
        <div className='bg-gray-100 rounded-md p-2 mt-2'>{content}</div>
        <div className='mt-1'>{task.description}</div>
        <div className='flex flex-grow items-end self-end mt-1'>
          {!editable && <Tag content={task.status} />}
          {editable &&(
            <>
              <Tag selectable selected={task.status === 'done'} onClick={() => handleChangeStatus('done')} content='done' />
              <Tag selectable selected={task.status === 'wont_do'} onClick={() => handleChangeStatus('wont_do')} content='wont_do' />
              <Tag selectable selected={task.status === 'on_hold'} onClick={() => handleChangeStatus('on_hold')} content='on_hold' />
              <Tag selectable selected={task.status === 'todo'} onClick={() => handleChangeStatus('todo')} content='todo' />
            </>
          )}
        </div>
      </div>
    </div>
  )
}


DetailedTask.propTypes = {
  task: PropTypes.shape({
    assignee: PropTypes.shape({
      publicId: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired
    }),
    createdAt: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
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
  availableAssignees: PropTypes.array,
  containerClassName: PropTypes.string,
  editable: PropTypes.bool,
  showAssignee: PropTypes.bool
}

export default DetailedTask
