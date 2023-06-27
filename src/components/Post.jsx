import React from 'react';
import moment from 'moment';

function Post({ postImg, postCaption, timestamp }) {
  return (
    <div className=' flex bg-gray-700  flex-col p-2 mb-2  rounded-2xl'>
      <img className='rounded-2xl w-[350px] ' src={postImg} alt="post" />
      <p className='text-center m-1 text-xl text-white font-extralight'>{postCaption}</p>
      <p><span className='text-gray-300 font-thin text-xs'>{timestamp}</span></p>
    </div>
  );
}

export default Post;
