import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../../../frontend/src/assets/assets';

const Navbar = ({ setToken }) => {
  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
  };

  return (
    <nav className='bg-white shadow-md'>
      <div className='mx-auto px-4 sm:px-6 lg:px-16'>
        <div className='flex justify-between h-16'>
          <div className='flex'>
            <div className='flex-shrink-0 flex items-center'>
              <Link to='/dashboard' className='text-xl font-bold text-gray-800'>
                <img className='w-[max(10%,80px)]' src={assets.logo} alt="" />
              </Link>
            </div>
          </div>
          <div className='flex items-center'>
            <button
              onClick={handleLogout}
              className='ml-4 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none'
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar