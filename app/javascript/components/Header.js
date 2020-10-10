import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import HomeIcon from 'images/home-icon.svg'

const Header = ({ history }) => {
  const pathname = history.location.pathname
  const visible = !pathname.match(/\/retrospectives\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/)

  if (!visible) return null

  return (
    <nav className='bg-gray-900 mb-6 shadow text-white' role='navigation'>
      <div className='container mx-auto p-4 flex flex-wrap items-center md:flex-no-wrap'>
        <Link to='/' className='block flex items-center'>
          <img src={HomeIcon} className='inline' width="24" />
          <span className='px-4'>Docto retro</span>
        </Link>

        <div className='flex flex-grow'>
          <Link to="/groups" className='ml-auto'>
            My groups
          </Link>
          <div className='justify-end ml-auto'>
            <a href='/logout'>Log out</a>
          </div>
        </div>
      </div>
    </nav>
  )
}

Header.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired
    }).isRequired
  })
}

export default withRouter(Header)
