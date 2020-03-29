import React from 'react'

const ParticipantsList = ({ participants, profile }) => {
  return (
    <div style={{ border: '1px solid gray' }}>
      {participants.map((participant, index) => <div key={index}>{participant}</div>)}
    </div>
  )
}

export default ParticipantsList
