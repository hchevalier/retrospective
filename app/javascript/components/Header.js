import React from 'react'
import { Link } from 'react-router-dom'
import HomeIcon from 'images/home-icon.svg'

const Header = () => (
<nav className='bg-gray-900 mb-6 shadow text-white' role='navigation'>
  <div className='container mx-auto p-4 flex flex-wrap items-center md:flex-no-wrap'>
    <div className='flex'>
      <Link to='/'>
        <img src={HomeIcon} width="24" />
        <span className='px-4'>Docto retro</span>
      </Link>
    </div>
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

export default Header
