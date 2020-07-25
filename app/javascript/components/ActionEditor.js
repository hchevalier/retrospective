import React from 'react'
import Button from './Button'
import { post, put, destroy } from 'lib/httpClient'
import { useSelector, shallowEqual } from 'react-redux'
import PropTypes from 'prop-types'
import Task from './Task'
import './ActionEditor.scss'

const ActionEditor = ({ reflectionId, reflectionContent }) => {
  const [description, setDescription] = React.useState('')
  const [assignee, setAssignee] = React.useState('')
  const [reflectionOnTypeStart, setReflectionOnTypeStart] = React.useState(null)
  const [editedTask, setEditedTask] = React.useState(null)

  const retrospectiveId = useSelector(state => state.retrospective.id)
  const participants = useSelector(state => state.participants, shallowEqual)
  const tasks = useSelector(state => state.tasks, shallowEqual)

  const onDescriptionChange = event => {
    if (!reflectionOnTypeStart) {
      setReflectionOnTypeStart({ id: reflectionId, content: reflectionContent })
    }
    setDescription(event.target.value)
  }

  const onTakeActionClick = () => {
    const method = editedTask ? put : post
    method({
      url: `/api/tasks${editedTask ? `/${editedTask}` : ''}`,
      payload: {
        reflection_id: reflectionOnTypeStart.id,
        assignee_id: assignee,
        description: description
      }
    })
      .then(() => {
        setDescription('')
        setAssignee('')
        setReflectionOnTypeStart(null)
        setEditedTask(null)
      })
      .catch(error => console.warn(error))
  }

  const resetReflectionOnTypeStart = () => {
    setReflectionOnTypeStart({ id: reflectionId, content: reflectionContent })
  }

  const handleEditClick = (task) => {
    setDescription(task.description)
    setAssignee(task.assignee.uuid)
    setReflectionOnTypeStart(task.reflection)
    setEditedTask(task.id)
  }

  const handleDeleteClick = (task) => {
    if (confirm('Are you sure?')) {
      destroy({ url: `/retrospectives/${retrospectiveId}/tasks/${task.id}` })
        .catch(error => console.warn(error))
    }
  }

  const handleCancelEditing = () => {
    setDescription('')
    setAssignee('')
    setReflectionOnTypeStart(null)
    setEditedTask(null)
  }

  return (
    <>
      <div id='action-editor'>
        {reflectionOnTypeStart && (
          <>
            {!editedTask && reflectionId !== reflectionOnTypeStart.id && <>
              <div>You are writing an action for a reflection that is not the one currently displayed</div>
              <div>({reflectionOnTypeStart.content})</div>
              <Button
                secondary
                onClick={resetReflectionOnTypeStart}>
                Change to currently displayed reflection
              </Button>
            </>}
            {editedTask && <>
              <div>You are editing an action for the following reflection:</div>
              <div>{reflectionOnTypeStart.content}</div>
            </>}
          </>
        )}
        <textarea placeholder='You can take actions here' name='content' className='w-full mb-1 border py-1 px-2 rounded' value={description} multiline='true' rows={8} onChange={onDescriptionChange} />
        <div id='assignee-select'>
          <select
            name='assignee'
            value={assignee}
            onChange={(event) => setAssignee(event.target.value)}
            className=" appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-2 px-3 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          >
            <option>assignee</option>
            {participants.map((participant, index) => <option key={index} value={participant.uuid}>{participant.surname}</option>)}
          </select>
        </div>
        <div className='mt-1 flex justify-evenly mt-1 w-full'>
          {editedTask && <>
            <Button contained primary onClick={onTakeActionClick}>Update</Button>
            <Button contained primary onClick={handleCancelEditing}>Cancel</Button>
          </>}
          {!editedTask && <Button contained primary onClick={onTakeActionClick}>Take action</Button>}
        </div>
      </div>

      <div id='tasks-list'>
        {tasks.filter((task) => task.reflection.id === reflectionId).map((task, index) => <Task key={index} task={task} onEdit={handleEditClick} onDelete={handleDeleteClick} />)}
      </div>
    </>
  )
}

ActionEditor.propTypes = {
  reflectionId: PropTypes.string,
  reflectionContent: PropTypes.string
}

export default ActionEditor
