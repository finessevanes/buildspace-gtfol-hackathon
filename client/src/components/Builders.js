import React from 'react'

const Builders = () => {
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
        <div>
            {
                builders.map((builder) => (
                    <div class="flex justify-center">
                        <div class="block p-4 rounded-lg shadow-lg bg-white  mt-6 opacity-75 bg-opacity-75">
                            <div classNames='' >
                                <img classNames='max-h-4' src={`https://avatars.githubusercontent.com/${builder.github}`}  alt="avatar images" />
                            </div>
                            <p class="text-buttontext font-bold mt-4 mb-4 text-center">
                                <span>{builder.name}</span>
                                <span>{builder.twitter}</span>
                                <span>{builder.github}</span>
                            </p>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default Builders
