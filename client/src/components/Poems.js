import React from 'react'
import { stickynoteContainer, stickyNote } from '../App.styles'

const Poems = ({ allPosts, handleDownVote, handleUpVote, hasClaimedNFT, voteIndex }) => {
  return (
    <div className={stickynoteContainer}>
        {allPosts.map((post, index) => {
          return (
            <div className="flex flex-col">
              <div key={index} className={`${stickyNote} ${index.toString() === voteIndex ? 'animate- shadow-yellow-300/50' : ''}`}>
                <p className='mb-12'>
                  {post.message}
                </p>
              </div>
              <div>
              {hasClaimedNFT && 
                (<div className="bg-red-400 rounded-xl m-4 flex place-content-evenly">
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
                        disabled={index.toString() !== voteIndex}
                        className={`hover:animate-bounce cursor-pointer text-3xl disabled:cursor-not-allowed disabled:opacity-50`}
                        value={index}
                        onClick={handleUpVote}>🍋</button>)
                  }
                  </div>
                  <span className='text-yellow-900 text-4xl'>{post.voteCount}</span>
                </div>
                )
              }
              </div>
              </div>
          )
        })}
      </div>
  )
}

export default Poems