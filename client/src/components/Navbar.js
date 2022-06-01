import React from 'react'
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className='bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded dark:bg-gray-800 text-right'>
      <div classNames='container flex flex-wrap justify-between items-center mx-auto'>

      </div>
      <ul className='inline-block text-right'>
        <li className='inline-block'>
          <Link to="/">Post a Poem</Link>
        </li>
        <li className='inline-block'>
          <Link  to="/builders">The builders</Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar