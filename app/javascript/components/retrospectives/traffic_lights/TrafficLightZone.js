import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { post } from 'lib/httpClient'
import SingleChoice from '../../SingleChoice'
import './TrafficLightZone.scss'

const TrafficLightZone = ({ reference, value }) => {
  const dispatch = useDispatch()

  const retrospectiveId = useSelector(state => state.retrospective.id)
  const [selectedChoice, setSelectedChoice] = React.useState(value)

  const { name, hint } = reference

  const onClick = (event) => {
    const { value } = event.currentTarget.dataset

    post({
      url: `/retrospectives/${retrospectiveId}/reflections`,
      payload: {
        content: value,
        zone_id: reference.id
      }
    })
      .then((data) => {
        dispatch({ type: 'replace-reflection', reflection: data })
        setSelectedChoice(value)
      })
      .catch(error => console.warn(error))
  }

  return (
    <div id={`zone-${name}`} className='zone'>
      <div>{name}</div>
      <div className='hint'>{hint}</div>
      <div>
        <SingleChoice value='red' zone={name} selected={selectedChoice === 'red'} onClick={onClick} badge={1} />
        <SingleChoice value='orange' zone={name} selected={selectedChoice === 'orange'} onClick={onClick} badge={1} />
        <SingleChoice value='green' zone={name} selected={selectedChoice === 'green'} onClick={onClick} badge={1} />
      </div>
    </div>
  )
}

TrafficLightZone.propTypes = {
  highlight: PropTypes.bool,
  reference: PropTypes.shape({
    id: PropTypes.number.isRequired,
    hint: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }),
  value: PropTypes.string
}

export default TrafficLightZone
