import React from 'react'
import { stickynoteContainer, stickyNote } from '../App.styles'

const Poems = ({ allPosts, handleDownVote, handleUpVote }) => {
  return (
    <div className={stickynoteContainer}>
        {allPosts.map((post, index) => {
          return (
            <div key={index} className={stickyNote}>
              Message: {post.message}
              <p>{post.voteCount}</p>
              <button className='cursor-pointer' value={index} onClick={handleUpVote}>🔥</button>
              <button className='cursor-pointer' value={index} onClick={handleDownVote}>💩</button>
            </div>
          )
        })}
      </div>
  )
}

export default Poems