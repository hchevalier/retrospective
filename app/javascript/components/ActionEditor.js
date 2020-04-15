import React from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

const ActionEditor = ({}) => {
  const [value, setValue] = React.useState('')

  const onChange = React.useCallback((event) => setValue(event.target.value))
  const onTakeActionClick = React.useCallback(() => alert('You took an action'))

  return (
    <div>
      <div>
        <TextField label='You can take actions here' name='content' variant='outlined' value={value} multiline rows={8} onChange={onChange} />
      </div>
      <div>
        <Button variant='contained' color='primary' onClick={onTakeActionClick}>Take action</Button>
      </div>
    </div>
  )
}

export default ActionEditor
