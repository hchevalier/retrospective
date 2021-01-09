import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const GroupListItem = ({ groupAccess, currentAccount, handleLeaveGroup }) => {
  const { group } = groupAccess

  return (
    <Link key={groupAccess.id} to={`/groups/${group.id}`}>
        <div className='p2 w-64'>
        <div className='flex flex-col bg-gray-200 rounded-md p-2 m-2'>
            <div className='border-b-2 border-gray-400'>
            <span className='font-bold text-blue-800'>{group.name}</span>
            </div>

            <div className='mt-1 text-sm'>{group.membersCount} members</div>
            <div className='mt-2 text-sm'>Created on {new Date(group.createdAt).toLocaleDateString()}</div>
            <div className='mt-1 text-sm'>Joined on {new Date(groupAccess.createdAt).toLocaleDateString()}</div>
            <div className='mt-2 text-sm'>{group.pendingTasksCount} actions pending</div>
            <div className='mt-1 text-sm'>{group.allTimeRetrospectivesCount} retrospectives since creation</div>

            <div className='flex flex-grow mt-4 items-end self-end'>
            {currentAccount && (
                <button
                className='bg-red-200 text-red-700 text-xxs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 rounded-full'
                onClick={(event) => { event.preventDefault(); handleLeaveGroup(groupAccess) }}>
                LEAVE
                </button>
            )}
            </div>
        </div>
        </div>
    </Link>
  )
}

GroupListItem.propTypes = {
  groupAccess: PropTypes.object.isRequired,
  currentAccount: PropTypes.object.isRequired,
  handleLeaveGroup: PropTypes.func.isRequired
}

export default GroupListItem
