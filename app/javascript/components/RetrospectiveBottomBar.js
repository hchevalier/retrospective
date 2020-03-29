import React from 'react'

const RetrospectiveBottomBar = ({ organizer }) => {
  return (
    <div>
      <div>Timer: 10:00</div>
      <div>New reflection</div>
      {organizer && <div>Next</div>}
    </div>
  )
}

export default RetrospectiveBottomBar
