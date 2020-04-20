import React from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import { post } from 'lib/httpClient'
import { useSelector, useDispatch } from 'react-redux'

const ActionEditor = ({}) => {
  const dispatch = useDispatch()

  const [description, setDescription] = React.useState('')
  const [assignee, setAssignee] = React.useState('')

  const retrospectiveId = useSelector(state => state.retrospective.id)
  const participants = useSelector(state => state.participants)
  const tasks = useSelector(state => state.tasks)

  const onDescriptionChange = React.useCallback((event) => setDescription(event.target.value))

  const onTakeActionClick = React.useCallback(() => {
    post({
      url: `/retrospectives/${retrospectiveId}/tasks`,
      payload: {
        assignee_id: assignee,
        title: 'Title', // TODO: remove this column from tasks table as it's useless
        description: description,
        status: 'todo'
      }
    })
    .then(data => {
      dispatch({ type: 'add-task', task: data })
      setDescription('')
      setAssignee('')
    })
    .catch(error => console.warn(error))
  }, [assignee, description])

  return (
    <>
      <div style={{ 'display': 'flex', 'flexDirection': 'column' }}>
        <div style={{ width: '200px', maxHeight: '200px', overflowY: 'scroll' }}>
          {tasks.map((task, index) => {
            return (<div key={index} style={{ 'backgroundColor': 'lightgray', 'margin': '10px 0', padding: '5px' }}>
              Assigned to {task.assignee.surname}<br />
              {task.description}
            </div>)
          })}
        </div>
        <TextField label='You can take actions here' name='content' variant='outlined' value={description} multiline rows={8} onChange={onDescriptionChange} />
        <FormControl style={{ marginLeft: '20px', minWidth: '200px' }}>
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
