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
              <p className='cursor-pointer' onClick={() => handleUpVote(index)}>🔥</p>
              <p className='cursor-pointer' onClick={() => handleDownVote(index)}>💩</p>
            </div>
          )
        })}
      </div>
  )
}

export default Poems