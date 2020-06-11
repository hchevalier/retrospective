import React from 'react'
import Header from './Header'
const Dashboard = () => {
  return (
    <div id='dashboard'>
      <Header />
      <div className='container'>
        <div className='max-w-xl mx-auto mt-8'>
          <p className='text-2xl'>
            Dashboard
          </p>
          <a className='bg-blue-500 hover:bg-blue-700 text-white font-medium py-1 px-2 rounded focus:outline-none focus:shadow-outline' href='/retrospectives/new'>
            Create a retrospective
          </a>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
