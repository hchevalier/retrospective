import React from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import { post, put, destroy } from 'lib/httpClient'
import { useSelector, shallowEqual } from 'react-redux'
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

  const onDescriptionChange = React.useCallback((event) => {
    if (!reflectionOnTypeStart) {
      setReflectionOnTypeStart({ id: reflectionId, content: reflectionContent })
    }
    setDescription(event.target.value)
  }, [reflectionId])

  const onTakeActionClick = React.useCallback(() => {
    const method = editedTask ? put : post
    method({
      url: `/retrospectives/${retrospectiveId}/tasks${editedTask ? `/${editedTask}` : ''}`,
      payload: {
        reflection_id: reflectionOnTypeStart.id,
        assignee_id: assignee,
        description: description
      }
    })
    .then(()=> {
      setDescription('')
      setAssignee('')
      setReflectionOnTypeStart(null)
      setEditedTask(null)
    })
    .catch(error => console.warn(error))
  }, [assignee, description, reflectionOnTypeStart, editedTask])

  const resetReflectionOnTypeStart = React.useCallback(() => {
    setReflectionOnTypeStart({ id: reflectionId, content: reflectionContent })
  }, [reflectionId, reflectionContent])

  const handleEditClick = React.useCallback((task) => {
    setDescription(task.description)
    setAssignee(task.assignee.uuid)
    setReflectionOnTypeStart(task.reflection)
    setEditedTask(task.id)
  }, [])

  const handleDeleteClick = React.useCallback((task) => {
    if (confirm('Are you sure?')) {
      destroy({ url: `/retrospectives/${retrospectiveId}/tasks/${task.id}` })
      .catch(error => console.warn(error))
    }
  })

  const handleCancelEditing = React.useCallback(() => {
    setDescription('')
    setAssignee('')
    setReflectionOnTypeStart(null)
    setEditedTask(null)
  }, [])

  return (
    <>
      <div id='action-editor'>
        {reflectionOnTypeStart && (
          <>
            {!editedTask && reflectionId !== reflectionOnTypeStart.id && <>
              <div>You are writing an action for a reflection that is not the one currently displayed</div>
              <div>({reflectionOnTypeStart.content})</div>
              <Button
                color='secondary'
                size='small'
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
        <TextField label='You can take actions here' name='content' variant='outlined' value={description} multiline rows={8} onChange={onDescriptionChange} />
        <FormControl id='assignee-select'>
          <InputLabel id='label-assignee'>Assignee</InputLabel>
          <Select
            labelId='label-assignee'
            name='assignee'
            value={assignee}
            onChange={(event) => setAssignee(event.target.value)}
          >
            {participants.map((participant, index) => <MenuItem key={index} value={participant.uuid}>{participant.surname}</MenuItem>)}
          </Select>
        </FormControl>
        <div>
          {editedTask && <>
            <Button variant='contained' color='primary' onClick={onTakeActionClick}>Update</Button>
            <Button variant='contained' color='primary' onClick={handleCancelEditing}>Cancel</Button>
          </>}
          {!editedTask && <Button variant='contained' color='primary' onClick={onTakeActionClick}>Take action</Button>}
        </div>
      </div>

      <div id='tasks-list'>
        {tasks.filter((task) => task.reflection.id === reflectionId).map((task, index) => <Task key={index} task={task} onEdit={handleEditClick} onDelete={handleDeleteClick} />)}
      </div>
    </>
  )
}

export default ActionEditor
