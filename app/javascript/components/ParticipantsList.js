import React from 'react'
import classNames from 'classnames'

const ParticipantsList = ({ participants, profile }) => {
  return (
    <div id='participants-list'>
      {participants.map(({ surname, organizer, uuid }, index) => (
        <div key={index} className={classNames({ 'organizer': organizer, 'yourself': profile?.uuid === uuid })}>
          {surname}
        </div>
      ))}
    </div>
  )
}

export default ParticipantsList
