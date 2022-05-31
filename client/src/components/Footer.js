import React from 'react'
import GithubLogo from '../assets/GitHub-Mark-64px.png';

const Footer = () => {
    const footer = `
    text-center lg:text-left bg-yellowbutton w-full opacity-90
    `
  return (
    <footer className={footer}>
    <div className="text-buttontext font-monoton text-center p-3">
    Weekend Hackathon
    </div>
    <div className='flex space text-xs'>
        <div>
        <img src={GithubLogo} />
            <span>@twitter</span>
        </div>
        <div>
            <span>@github</span>
            <span>@twitter</span>
        </div>
        <div>
            <span>@github</span>
            <span>@twitter</span>
        </div>
        <div>
            <span>@github</span>
            <span>@twitter</span>
        </div>
    </div>
  </footer>
  )
}

export default Footer