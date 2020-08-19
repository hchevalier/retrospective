import React from 'react'
import PropTypes from 'prop-types'
import SingleChoice from '../../SingleChoice'
import './TrafficLightZone.scss'

const TrafficLightResult = ({ reflection, onClick }) => {
  const { details, hint, name } = reflection.zone

  return (
    <div id={`zone-${name}`} className='zone' onClick={onClick} >
      <div>{name}</div>
      <div className='hint'>{hint}</div>
      <div className='flex justify-center'>
        <SingleChoice value='red' selected collapsed badge={details.red} />
        <SingleChoice value='orange' selected collapsed badge={details.orange} />
        <SingleChoice value='green' selected collapsed badge={details.green} />
      </div>
    </div>
  )
}

export default TrafficLightResult
