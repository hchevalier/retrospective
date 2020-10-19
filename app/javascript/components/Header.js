import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { historyShape } from 'lib/utils/shapes'
import HomeIcon from 'images/home-icon.svg'

const MenuItem = ({ label, icon, active, target }) => {
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
      <svg className="h-6 w-6 fill-current mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M3.889 3h6.222a.9.9 0 0 1 .889.91v8.18a.9.9 0 0 1-.889.91H3.89A.9.9 0 0 1 3 12.09V3.91A.9.9 0 0 1 3.889 3zM3.889 15h6.222c.491 0 .889.384.889.857v4.286c0 .473-.398.857-.889.857H3.89C3.398 21 3 20.616 3 20.143v-4.286c0-.473.398-.857.889-.857zM13.889 11h6.222a.9.9 0 0 1 .889.91v8.18a.9.9 0 0 1-.889.91H13.89a.9.9 0 0 1-.889-.91v-8.18a.9.9 0 0 1 .889-.91zM13.889 3h6.222c.491 0 .889.384.889.857v4.286c0 .473-.398.857-.889.857H13.89C13.398 9 13 8.616 13 8.143V3.857c0-.473.398-.857.889-.857z" />
      </svg> {label}
    </Link>
  )
}

MenuItem.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.node,
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
            <MenuItem label='Dashboard' target='/' active={pathname === '/'} />
          </div>
          <div className='flex -mb-px mr-8'>
            <MenuItem label='My groups' target='/groups' active={pathname.match(/\/groups/) !== null}/>
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
