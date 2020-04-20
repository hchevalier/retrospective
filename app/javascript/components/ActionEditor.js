import React from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import { post } from 'lib/httpClient'
import { useSelector, useDispatch } from 'react-redux'
import './ActionEditor.scss'

const ActionEditor = ({ reflectionId, reflectionContent }) => {
  const dispatch = useDispatch()

  const [description, setDescription] = React.useState('')
  const [assignee, setAssignee] = React.useState('')
  const [reflectionOnTypeStart, setReflectionOnTypeStart] = React.useState(null)

  const retrospectiveId = useSelector(state => state.retrospective.id)
  const participants = useSelector(state => state.participants)
  const tasks = useSelector(state => state.tasks)

  const onDescriptionChange = React.useCallback((event) => {
    if (!reflectionOnTypeStart) {
      setReflectionOnTypeStart({ id: reflectionId, content: reflectionContent })
    }
    setDescription(event.target.value)
  }, [reflectionId])

  const onTakeActionClick = React.useCallback(() => {
    post({
      url: `/retrospectives/${retrospectiveId}/tasks`,
      payload: {
        reflection_id: reflectionOnTypeStart.id,
        assignee_id: assignee,
        description: description
      }
    })
    .then(data => {
      setDescription('')
      setAssignee('')
      setReflectionOnTypeStart(null)
    })
    .catch(error => console.warn(error))
  }, [assignee, description, reflectionOnTypeStart])

  const resetReflectionOnTypeStart = React.useCallback(() => {
    setReflectionOnTypeStart({ id: reflectionId, content: reflectionContent })
  }, [reflectionId, reflectionContent])

  return (
    <>
      <div id='action-editor'>
        <div id='tasks-list'>
          {tasks.filter((task) => task.reflectionId === reflectionId).map((task, index) => {
            return (<div key={index} className='task'>
              Assigned to {task.assignee.surname}<br />
              {task.description}
            </div>)
          })}
        </div>
        {reflectionOnTypeStart && reflectionId !== reflectionOnTypeStart.id && (
          <>
            <div>You are writing an action for a reflection that is not the one currently displayed</div>
            <div>({reflectionOnTypeStart.content})</div>
            <Button
              color='secondary'
              size='small'
              onClick={resetReflectionOnTypeStart}>
              Change to currently displayed reflection
            </Button>
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
      </div>
      <div>
        <Button variant='contained' color='primary' onClick={onTakeActionClick}>Take action</Button>
      </div>
    </>
  )
}

export default ActionEditor
