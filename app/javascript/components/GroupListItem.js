import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Link } from 'react-router-dom'

const JOIN_BUTTON_LABEL = 'JOIN'
const LEAVE_BUTTON_LABEL = 'LEAVE'

const GroupListItem = ({ groupAccess, currentAccount, handleJoinGroup, handleLeaveGroup }) => {
  const { group } = groupAccess
  const WrapperComponent = handleJoinGroup ? Fragment : Link
  const wrapperProps = handleJoinGroup ? {} : { to: `/groups/${group.id}` }

  return (
    <WrapperComponent {...wrapperProps}>
        <div className='p2 w-64'>
        <div className='flex flex-col bg-gray-200 rounded-md p-2 m-2'>
            <div className='border-b-2 border-gray-400'>
            <span className='font-bold text-blue-800'>{group.name}</span>
            </div>

            <div className='mt-1 text-sm'>{group.membersCount} members</div>
            <div className='mt-2 text-sm'>Created on {new Date(group.createdAt).toLocaleDateString()}</div>
            <div className='mt-1 text-sm'>
              {handleJoinGroup ? 'Invited' : 'Joined'} on {new Date(groupAccess.createdAt).toLocaleDateString()}
            </div>
            <div className='mt-2 text-sm'>{group.pendingTasksCount} actions pending</div>
            <div className='mt-1 text-sm'>{group.allTimeRetrospectivesCount} retrospectives since creation</div>

            <div className='flex flex-grow mt-4 items-end self-end'>
            {currentAccount && (
                <button
                className={classNames('text-xxs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 rounded-full', {
                  'bg-blue-200 text-blue-700': handleJoinGroup,
                  'bg-red-200 text-red-700': !handleJoinGroup,
                 })}
                onClick={(event) => {
                  event.preventDefault()
                  handleJoinGroup
                    ? handleJoinGroup(groupAccess)
                    : handleLeaveGroup(groupAccess)
                }}>
                {handleJoinGroup ? JOIN_BUTTON_LABEL : LEAVE_BUTTON_LABEL}
                </button>
            )}
            </div>
        </div>
        </div>
    </WrapperComponent>
  )
}

GroupListItem.propTypes = {
  groupAccess: PropTypes.object.isRequired,
  currentAccount: PropTypes.object.isRequired,
  handleJoinGroup: PropTypes.func,
  handleLeaveGroup: PropTypes.func,
}

export default GroupListItem
