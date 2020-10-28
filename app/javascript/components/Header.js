import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { historyShape } from 'lib/utils/shapes'
import DashboardIcon from 'images/dashboard-icon.inline.svg'
import GroupIcon from 'images/group-icon.inline.svg'

const MenuItem = ({ label, icon, active, target }) => {
  const IconComponent = icon

  return (
    <Link
      to={target}
      className={classNames(
        'no-underline flex items-center py-4 border-b',
        {
          'text-blue-700 border-blue-700': active,
          'opacity-50 text-grey-700 border-transparent hover:opacity-75 hover:border-grey-700': !active
        }
      )}>
      <IconComponent className='pr-1 w-6 h-6' /> {label}
    </Link>
  )
}

MenuItem.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
  active: PropTypes.bool,
  target: PropTypes.string
}

const Header = ({ history }) => {
  const pathname = history.location.pathname
  const visible =
    !pathname.match(/\/retrospectives\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/) &&
    !pathname.match(/\/sessions\/new/)

  if (!visible) return null

  return (
    <div className='block bg-white border-b border-gray-400'>
      <div className='container mx-auto px-4'>
        <div className='flex'>
          <div className='flex -mb-px mr-8'>
            <MenuItem label='Dashboard' target='/' icon={DashboardIcon} active={pathname === '/'} />
          </div>
          <div className='flex -mb-px mr-8'>
            <MenuItem label='My groups' target='/groups' icon={GroupIcon} active={pathname.match(/\/groups/) !== null}/>
          </div>
          <div className='flex -mb-px flex-grow'>
            <div className='justify-end ml-auto'>
              <a href='/logout' className='no-underline flex items-center py-4 border-b opacity-50 text-grey-700 border-transparent hover:opacity-75 hover:border-grey-700'>
                Log out
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

Header.propTypes = {
  history: historyShape
}

export default withRouter(Header)
