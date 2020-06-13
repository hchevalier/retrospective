import React from 'react'
import HomeIcon from 'images/home-icon.svg'

const Header = () => (
<nav className='bg-gray-900 mb-6 shadow text-white' role='navigation'>
  <div className='container mx-auto p-4 flex flex-wrap items-center md:flex-no-wrap'>
    <div className='flex'>
      <a href='/'>
        <img src={HomeIcon} width="24" />
      </a>
      <span className='px-4'>Docto retro</span>
    </div>
    <div className='flex flex-grow'>
      <div className='justify-end ml-auto'>
        <a href='/logout'>Log out</a>
      </div>
      </div>
    </div>
  </nav>
)

export default Header
