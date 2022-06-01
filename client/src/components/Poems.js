import React from 'react'
import { stickynoteContainer, stickyNote, votingContainer } from '../App.styles'

const Poems = ({ allPosts, handleDownVote, handleUpVote, hasClaimedNFT, voteIndex }) => {
  return (
    <div className={`${stickynoteContainer} flex-wrap
`}>
        {allPosts.map((post, index) => {
          return (
            <div key={index} className="flex flex-col">
              <div className={`${stickyNote} ${index.toString() === voteIndex ? 'animate- shadow-yellow-300/50' : ''}`}>
                <p className='mb-12'>
                  {post.message}
                </p>
              </div>
              <div>
              {hasClaimedNFT && 
                (<div className="bg-buttontext rounded-xl p-2 m-4 flex place-content-evenly">
                  <div className="flex">
                    {index.toString() === voteIndex ?
                      (
                        <button
                          className={`hover:animate-bounce cursor-pointer mr-1 text-3xl ${!hasClaimedNFT && 'cursor-not-allowed opacity-50'}`}
                          value={index}
                          onClick={handleDownVote}>
                        🍋
                      </button>
                      ) 
                      : (<button
                        disabled={index.toString() !== voteIndex && voteIndex !== ''}
                        className={`hover:animate-bounce cursor-pointer text-3xl disabled:cursor-not-allowed disabled:opacity-50`}
                        value={index}
                        onClick={handleUpVote}>🍋</button>)
                  }
                  </div>
                  <span className='text-yellowbutton text-4xl'>{post.voteCount}</span>
                </div>
                )
                }
                {hasClaimedNFT &&
                  (<div className="bg-buttontext rounded-xl p-2 m-4 flex place-content-evenly">
                  <span className='text-yellowbutton text-4xl'>{post.voteCount}🍋</span>
                </div>
                )}
              </div>
              </div>
          )
        })}
      </div>
  )
}

export default Poems