import React from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { post } from 'lib/httpClient'
import classNames from 'classnames'
import './TrafficLightZone.scss'

const TrafficLightZone = ({ reference, hint, value }) => {
  const retrospectiveId = useSelector(state => state.retrospective.id)
  const [selectedChoice, setSelectedChoice] = React.useState(value)

  const { name } = reference

  const onClick = (event) => {
    const { value } = event.currentTarget.dataset

    post({
      url: `/retrospectives/${retrospectiveId}/reflections`,
      payload: {
        content: value,
        zone_id: reference.id
      }
    })
      .then(() => setSelectedChoice(value))
      .catch(error => console.warn(error))
  }

  return (
    <div id={`zone-${name}`} className='zone'>
      <div>{name}</div>
      <div className='hint'>{hint}</div>
      <div>
        <div data-id={`zone-${name}`} data-value='green' className={classNames('choice green', { selected: selectedChoice === 'green' })} onClick={onClick}></div>
        <div data-id={`zone-${name}`} data-value='orange' className={classNames('choice orange', { selected: selectedChoice === 'orange' })} onClick={onClick}></div>
        <div data-id={`zone-${name}`} data-value='red' className={classNames('choice red', { selected: selectedChoice === 'red' })} onClick={onClick}></div>
      </div>
    </div>
  )
}

TrafficLightZone.propTypes = {
  highlight: PropTypes.bool,
  reference: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  }),
  hint: PropTypes.string.isRequired,
  value: PropTypes.string
}

export default TrafficLightZone
