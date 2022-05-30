import React from 'react'
import { stickynoteContainer, stickyNote } from '../App.styles'

const Poems = ({ allPosts, handleDownVote, handleUpVote, hasClaimedNFT }) => {
  return (
    <div className={stickynoteContainer}>
        {allPosts.map((post, index) => {
          console.log(post)
          return (
            <div key={index} className={stickyNote}>
              <p className='mb-12'>
              {post.message}
              </p>
              {hasClaimedNFT && 
                (<>
                  <span className='text-4xl mr-12'>{post.voteCount}</span>
                  <button className={`cursor-pointer mr-1 text-3xl ${!hasClaimedNFT && 'cursor-not-allowed opacity-50'}`}  value={index} onClick={handleUpVote}>🔥</button>
                  <button className={`cursor-pointer text-3xl ${hasClaimedNFT && 'cursor-not-allowed opacity-50'}`} value={index} onClick={handleDownVote}>💩</button>
                </>)
              }
            </div>
          )
        })}
      </div>
  )
}

export default Poems