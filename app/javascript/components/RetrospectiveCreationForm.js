import React from 'react'
import { get, post } from 'lib/httpClient'
import Input from './Input'
import Button from './Button'

const RetrospectiveCreationForm = () => {
  const [retrospectiveKinds, setRetrospectiveKinds] = React.useState([])
  const [retrospectiveName, setRetrospectiveName] = React.useState('')
  const [retrospectiveKind, setRetrospectiveKind] = React.useState('')

  React.useEffect(() => {
    get({ url: '/api/retrospective_kinds' })
      .then((data) => setRetrospectiveKinds(data))
  }, [])

  const createRetrospective = (event) => {
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

  const formInvalid =  !retrospectiveName || !retrospectiveKind

  return (
    <div className='container'>
      <form noValidate autoComplete='off' className='max-w-xl mx-auto mt-4' onSubmit={createRetrospective}>
        <div className='grid grid-cols-2 gap-4 mb-4'>
          <div>
            <label>Team name</label>
            <Input placeholder='Team name' name='retrospective_name' value={retrospectiveName} onChange={(event) => setRetrospectiveName(event.target.value)} />
          </div>
          <div>
            <label id='label-kind'>Retrospective kind</label>
            <select
              id='label-kind'
              name='retrospective_kind'
              value={retrospectiveKind}
              onChange={(event) => setRetrospectiveKind(event.target.value)}
              className=" appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-2 px-3 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
              <option>Select one</option>
              {retrospectiveKinds.map((kind, index) => <option key={index} value={kind}>{kind}</option>)}
            </select>
          </div>
        </div>

        <Button primary contained disabled={formInvalid} onClick={createRetrospective}>Start retrospective</Button>
      </form>
    </div>
  )
}

export default RetrospectiveCreationForm
