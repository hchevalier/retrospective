import React from 'react'
import PropTypes from 'prop-types'
import TooltipToggler from '../../TooltipToggler'
import SingleChoice from '../../SingleChoice'
import './TrafficLightZone.scss'

const TrafficLightResult = ({ reflection, onClick }) => {
  const { details, hint, name } = reflection.zone

  return (
    <div id={`zone-${name}`} className='mt-2 bg-gray-200 p-2 rounded-md' onClick={onClick} >
      <div className='flex flex-row justify-between'>
        <span className='font-medium'>{name}</span>
        <TooltipToggler content={hint} fixed />
      </div>
      <div className='flex justify-center'>
        <SingleChoice value='red' selected collapsed badge={details.red} />
        <SingleChoice value='orange' selected collapsed badge={details.orange} />
        <SingleChoice value='green' selected collapsed badge={details.green} />
      </div>
    </div>
  )
}

export default TrafficLightResult
