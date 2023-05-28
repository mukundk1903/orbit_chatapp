import React from 'react'
import { DownloadIcon } from '@heroicons/react/outline'

function Hero() {
  return (
    <div className='bg-orbit_white pb-8 md:pb-0'>
        <div className='p-7 py-9 h-screen md:flex relative md:h-[90vh]  '>
            <div className='flex flex-col gap-7 md:max-w-md lg:max-w-none lg:justify-center'>
                <h1 className='text-5xl text-gray-800 font-bold'>Create Your Community</h1>
                <h2 className='text-gray-600 text-lg font-sans tracking-wide lg:max-w-3xl w-full'>Whether you're part of a school club, Gaming group, Worldwide Art Community,
                 or just a handful of friends that want to spend time together,
                 Discord makes it easy to spend time together, Orbit makes it easy to talk every day and hangout more often
                </h2>
                <div className='flex flex-col sm:flex-row md:flex-col lg:flex-row md:items-start sm:items-center gap-4'>
                    <button className='bg-gray-400  rounded-full py-2 px-4 flex items-center justify-center text-lg hover:shadow-2xl hover:text-discord_blue focus:outline-none'>
                        <DownloadIcon className='w-6 mr-2'/>
                        Download </button>
                    <button className='bg-gray-900 font-medium flex items-center justify-center
                     text-lg hover:shadow-2xl  text-white rounded-full py-2 px-4 hover:bg-gray-800
                     focus:outline-none transition duration-200 ease-in-out'>
                        Open Orbit In Your Browser
                    </button>
                </div>
            </div>
            <div className='flex-grow'>
                <img src="https://cdni.iconscout.com/illustration/premium/thumb/two-male-and-female-friends-standing-together-2762611-2314993.png" 
                alt="hero" 
                className=' rounded-md absolute w-[600px] mt-16 md:hidden' />
                <img src="https://cdni.iconscout.com/illustration/premium/thumb/different-age-of-people-standing-in-one-group-2762607-2314988.png" 
                alt="hero" 
                className=' hidden md:inline absolute' />
            </div>
        </div>
    </div>
  )
}

export default Hero