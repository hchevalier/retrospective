import React from 'react'
import HomeIcon from 'images/home-icon.svg'

const Header = () => (
  <nav className='bg-gray-900 mb-6 shadow text-white' role='navigation'>
    <div className='container mx-auto p-4 flex flex-wrap items-center md:flex-no-wrap'>
      <div className="mr-4 md:mr-8">
        <a href='/'>
          <img src={HomeIcon} width="24" />
        </a>
      </div>
      <div className='mr-4 md:mr-8'>
        Docto retro
      </div>
    </div>
  </nav>
)

export default Header
