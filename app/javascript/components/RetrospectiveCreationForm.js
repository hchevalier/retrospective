import React from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import PropTypes from 'prop-types'
import { post } from 'lib/httpClient'

const RetrospectiveCreationForm = ({ retrospective_kinds: retrospectiveKinds }) => {
  const [retrospectiveName, setRetrospectiveName] = React.useState('')
  const [retrospectiveKind, setRetrospectiveKind] = React.useState('')

  const createRetrospective = () => {
    post({
      url: '/retrospectives',
      payload: {
        name: retrospectiveName,
        kind: retrospectiveKind
      }
    })
    .then(data => { window.location.pathname = `/retrospectives/${data.id}` })
    .catch(error => console.warn(error))
  }

  return (
    <form noValidate autoComplete='off'>
      <TextField label='Team name' name='retrospective_name' value={retrospectiveName} onChange={(event) => setRetrospectiveName(event.target.value)} />
      <FormControl style={{ marginLeft: '20px', minWidth: '200px' }}>
        <InputLabel id='label-kind'>Retrospective kind</InputLabel>
        <Select
          labelId='label-kind'
          name='retrospective_kind'
          value={retrospectiveKind}
          onChange={(event) => setRetrospectiveKind(event.target.value)}
          >
          {retrospectiveKinds.map((kind, index) => <MenuItem key={index} value={kind}>{kind}</MenuItem>)}
        </Select>
      </FormControl>

      <Button variant='contained' color='primary' onClick={createRetrospective}>Start retrospective</Button>
    </form>
  )
}

// TODO: PropTypes.retrospectiveKinds
RetrospectiveCreationForm.propTypes = {
  retrospective_kinds: PropTypes.array
}

export default RetrospectiveCreationForm
