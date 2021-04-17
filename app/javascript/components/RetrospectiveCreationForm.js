import React from 'react'
import { get, post } from 'lib/httpClient'
import { RETROSPECTIVE_NAMES } from 'lib/utils/displayNames'
import { RETROSPECTIVE_DESCRIPTIONS } from 'lib/utils/displayDescriptions'
import Card from './Card'
import DropDown from './DropDown'
import './RetrospectiveCreationForm.scss'

const RetrospectiveCreationForm = () => {
  const [existingGroups, setExistingGroups] = React.useState([])
  const [retrospectiveKinds, setRetrospectiveKinds] = React.useState([])
  const [newGroupName, setNewGroupName] = React.useState('')
  const [retrospectiveGroup, setRetrospectiveGroup] = React.useState('')
  const [retrospectiveKind, setRetrospectiveKind] = React.useState('')

  React.useEffect(() => {
    get({ url: '/api/retrospective_kinds' })
      .then((data) => setRetrospectiveKinds(data))
  }, [])

  React.useEffect(() => {
    get({ url: '/api/groups' })
      .then((data) => setExistingGroups(data))
  }, [])

  const handleSubmit = () => {
    if (newGroupName) {
      post({
        url: '/api/groups',
        payload: {
          name: newGroupName
        }
      })
        .then(group => {
          createRetrospective(group.id)
        })
        .catch(error => console.warn(error))
    } else {
      createRetrospective()
    }
  }

  const createRetrospective = (newGroupId) => {
    post({
      url: '/retrospectives',
      payload: {
        group_id: retrospectiveGroup || newGroupId,
        kind: retrospectiveKind
      }
    })
      .then(data => { window.location.pathname = `/retrospectives/${data.id}` })
      .catch(error => console.warn(error))
  }

  const handleSelectedNewGroup = (name) => {
    setRetrospectiveGroup('')
    setNewGroupName(name)
  }

  const displayDescription = () => { return RETROSPECTIVE_DESCRIPTIONS[retrospectiveKind] }

  const handleSelectedExistingGroup = (groupId) => {
    setRetrospectiveGroup(groupId)
    setNewGroupName('')
  }

  const formInvalid = (!retrospectiveGroup && !newGroupName) || !retrospectiveKind
  const groupOptions = React.useMemo(() => existingGroups.map((group) => ({ label: group.name, value: group.id })), [existingGroups])

  return (
    <div className='container mx-auto'>
      <form noValidate autoComplete='off' className='mt-4' onSubmit={handleSubmit}>
        <Card className='gap-4 mb-4' title='Settings' center actionLabel='START RETROSPECTIVE' onAction={handleSubmit} actionDisabled={formInvalid}>
          <div className='flex flex-row max-w-xl justify-evenly'>
            <div>
              <label>Group</label>
              <DropDown name='group_name' options={groupOptions} allowNew onItemSelected={handleSelectedExistingGroup} onItemAdded={handleSelectedNewGroup} />
            </div>
            <div className='ml-8'>
              <label id='label-kind'>Retrospective kind</label>
              <select
                id='label-kind'
                name='retrospective_kind'
                value={retrospectiveKind}
                onChange={(event) => setRetrospectiveKind(event.target.value)}
                className=" appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-2 px-3 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                <option>Select one</option>
                {retrospectiveKinds.map((kind, index) => <option key={index} value={kind}>{RETROSPECTIVE_NAMES[kind]}</option>)}
              </select>
            </div>
          </div>
        </Card>
        { !!retrospectiveKind &&
          <Card className='gap-4 mb-4' title='Description'>
            <div className='display-linebreak'>{displayDescription()}</div>
          </Card>
         }
      </form>
    </div>
  )
}

export default RetrospectiveCreationForm
