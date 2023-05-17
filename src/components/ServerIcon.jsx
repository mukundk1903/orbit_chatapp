import React from 'react'

function ServerIcon({image}) {
  return (
    <img
     src={image} 
     alt="icon"
     className='h-12 w-12  object-cover cursor-pointer rounded-full transition-all duration-100
     ease-out hover:rounded-2xl'
    />
  )
}

export default ServerIcon