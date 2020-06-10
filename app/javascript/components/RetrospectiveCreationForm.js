import React from 'react'
import Header from './Header'
import Input from './Input'
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
    <>
      <Header />
      <div className='container'>

        <form noValidate autoComplete='off' className='max-w-xl mx-auto mt-4' onSubmit={createRetrospective}>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label>Team name</label>
              <Input placeholder='Team name' name='retrospective_name' value={retrospectiveName} onChange={(event) => setRetrospectiveName(event.target.value)} />
            </div>
            <div>
              <label id='label-kind'>Retrospective kind</label>
              <select
                labelId='label-kind'
                name='retrospective_kind'
                value={retrospectiveKind}
                onChange={(event) => setRetrospectiveKind(event.target.value)}
                className=" appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-2 px-3 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                <option>Select one</option>
                {retrospectiveKinds.map((kind, index) => <option key={index} value={kind}>{kind}</option>)}
              </select>
            </div>
          </div>

          <button className='bg-blue-500 hover:bg-blue-700 mt-4 text-white font-medium py-1 px-2 rounded focus:outline-none focus:shadow-outline' type='submit'>
            Start retrospective
          </button>
        </form>
      </div>
    </>
  )
}

// TODO: PropTypes.retrospectiveKinds
RetrospectiveCreationForm.propTypes = {
  retrospective_kinds: PropTypes.array
}

export default RetrospectiveCreationForm
