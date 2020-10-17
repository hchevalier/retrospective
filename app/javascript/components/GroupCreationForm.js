import React from 'react'
import { post } from 'lib/httpClient'
import Input from './Input'
import Button from './Button'

const GroupCreationForm = () => {
  const [groupName, setGroupName] = React.useState('')

  const createGroup = () => {
    post({
      url: '/api/groups',
      payload: {
        name: groupName
      }
    })
      .then(() => { window.location.pathname = `/groups` })
      .catch(error => console.warn(error))
  }

  const formInvalid = !groupName

  return (
    <div className='container mx-auto'>
      <form noValidate autoComplete='off' className='max-w-xl mx-auto mt-4' onSubmit={createGroup}>
        <div className='grid grid-cols-2 gap-4 mb-4'>
          <div>
            <label>Group name</label>
            <Input placeholder='Group name' name='group_name' value={groupName} onChange={(event) => setGroupName(event.target.value)} />
          </div>
        </div>

        <Button primary contained disabled={formInvalid} onClick={createGroup}>Create</Button>
      </form>
    </div>
  )
}

export default GroupCreationForm
