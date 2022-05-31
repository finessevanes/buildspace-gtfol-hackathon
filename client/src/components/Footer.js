import React from 'react'
import GithubLogo from '../assets/GitHub-Mark-64px.png';

const Footer = () => {
    const footer = `
    flex
    flex-row
    pb-3
    text-xs
    lg:text-left
    text-buttontext
    font-monoton
    w-full
    bg-yellowbutton
    opacity-90
    `
    return (
        <footer className={footer}>
            <p className='mt-8 ml-2'>
                {'buildspace presents '}
                <a href='https://lu.ma/vcp49bf7?tk=OQEjuv'>
                    <span className='font-black underline text-md'>weekend hackathon</span>
                    {' by weekend crew ⛵️'}
                </a>
            </p>
        </footer>
    )
}

export default Footer