import React from 'react'

const ContactUs = () => {
    const builders = [
        {
            name: 'dri',
            twitter: '_finessevanes',
            github: 'finessevanes'
        },
        {
            name: 'vanes',
            twitter: '_finessevanes',
            github: 'finessevanes'
        },
        {
            name: 'julia',
            twitter: '_finessevanes',
            github: 'finessevanes'
        },
        {
            name: 'moonplanet',
            twitter: '_finessevanes',
            github: 'finessevanes'
        }
    ]
  return (
    <div>
        {
            builders.map((builder)=> (
                <div>
                    <span>{builder.name}</span><span>{builder.twitter}</span><span>{builder.github}</span>
                </div>
            ))
        }
    </div>
  )
}

export default ContactUs