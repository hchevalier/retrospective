import React from 'react'
import Button from './Button'
import { get, post, put, destroy } from 'lib/httpClient'
import { useSelector, shallowEqual } from 'react-redux'
import PropTypes from 'prop-types'
import Card from './Card'
import Task from './Task'
import './ActionEditor.scss'

const ActionEditor = ({ reflectionId, reflectionContent }) => {
  const [description, setDescription] = React.useState('')
  const [assignee, setAssignee] = React.useState('')
  const [reflectionOnTypeStart, setReflectionOnTypeStart] = React.useState(null)
  const [editedTask, setEditedTask] = React.useState(null)
  const [members, setMembers] = React.useState([])

  const { id: retrospectiveId, zonesTypology } = useSelector(state => state.retrospective)
  const groupId = useSelector(state => state.retrospective.group.id)
  const tasks = useSelector(state => state.tasks, shallowEqual)

  React.useEffect(() => {
    get({ url: `/api/groups/${groupId}` })
      .then((data) => setMembers(data.members))
  }, [groupId])

  const onDescriptionChange = event => {
    if (!reflectionOnTypeStart && event.target.value.length > 0) {
      setReflectionOnTypeStart({ id: reflectionId, content: reflectionContent })
    } else if (reflectionOnTypeStart && !editedTask && event.target.value.length == 0) {
      setReflectionOnTypeStart(null)
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
    setAssignee(task.assignee.publicId)
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
      <Card vertical>
        <div id='action-editor'>
          {reflectionOnTypeStart && (
            <>
              {!editedTask && reflectionId !== reflectionOnTypeStart.id && <>
                <div>You are writing an action for a reflection that is not the one currently displayed</div>
                <div>({zonesTypology === 'single_choice' ? reflectionOnTypeStart.zone.name : reflectionOnTypeStart.content})</div>
                <Button
                  secondary
                  onClick={resetReflectionOnTypeStart}>
                  Change to currently displayed reflection
                </Button>
              </>}
              {editedTask && <>
                <div>You are editing an action for the following reflection:</div>
                <div>{zonesTypology === 'single_choice' ? reflectionOnTypeStart.zone.name : reflectionOnTypeStart.content}</div>
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
              <option>Choose an assignee</option>
              {members.map((account, index) => <option key={index} value={account.publicId}>{account.username}</option>)}
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
      </Card>

      <Card vertical title='Actions' containerClassName='mt-4'>
        <div id='tasks-list'>
          {tasks.filter((task) => task.reflection.id === reflectionId).map((task, index) => <Task key={index} task={task} onEdit={handleEditClick} onDelete={handleDeleteClick} />)}
        </div>
      </Card>
    </>
  )
}

ActionEditor.propTypes = {
  reflectionId: PropTypes.string,
  reflectionContent: PropTypes.string
}

export default ActionEditor
