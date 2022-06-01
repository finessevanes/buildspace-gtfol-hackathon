import React from 'react'
const Footer = () => {
    const footer = `
    flex
    flex-row
    p-3
    flex-col
    text-xs
    text-buttontext
    text-center
    font-monoton
    w-full
    bg-yellowbutton
    opacity-90
    fixed
    bottom-0
    `
    const builders = [
        {
            name: 'dri',
            twitter: '_finessevanes',
            github: 'driespindola'
        },
        {
            name: 'vanes',
            twitter: '_finessevanes',
            github: 'finessevanes'
        },
        {
            name: 'julia',
            twitter: '_finessevanes',
            github: 'jmaille664'
        },
        {
            name: 'vera',
            twitter: '_finessevanes',
            github: 'zxlvera'
        }
    ]

    return (
        <footer className={footer}>
            <p className='my-1 md:text-[9px] md:m-1'>
                {'buildspace presents '}
                <a href='https://lu.ma/vcp49bf7?tk=OQEjuv'>
                    <span className='font-black underline md:text-[14px]'>weekend hackathon</span>
                    {' by weekend crew ⛵️'}
                </a> 
                <br />
                this app was 🚢 shipped by
                {
                    builders.map((item, i) => (
                        <a href={`https://github.com/${item.github}`} target='_blank'> @{item.name}</a>
                    ))
                }
            </p>
        </footer>
    )
}

export default Footer