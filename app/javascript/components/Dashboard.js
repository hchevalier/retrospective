import React from 'react'
import Button from '@material-ui/core/Button'

const Dashboard = () => {
  const handleCreateRetrospectiveClick = () => {
    window.location.pathname = '/retrospectives/new'
  }

  return (
    <div id='dashboard'>
      Dashboard
      <Button variant='contained' color='primary' onClick={handleCreateRetrospectiveClick}>Create a retrospective</Button>
    </div>
  )
}

export default Dashboard
