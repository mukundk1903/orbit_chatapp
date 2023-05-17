import React from 'react'
import {MenuIcon} from "@heroicons/react/outline";
import { useAuthState }  from "react-firebase-hooks/auth";
import {auth, provider} from "../base";
import {useNavigate} from "react-router-dom"


function Header() {
    const history = useNavigate();
    const [user] = useAuthState(auth);

    const signIn = (e) => {
        e.preventDefault();
        auth
        .signInWithPopup(provider)
        .then(() => history("/channels"))
        .catch((error) => alert(error.message));
    };

  return (
    <header className='flex items-center justify-between py-4 px-6 bg-discord_blue'>
        <a href="/">
            <img src="https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6cc3c481a15a141738_icon_clyde_white_RGB.png" 
            alt="" 
            className='w-32 h-12 object-contain'
            />
        </a>
        <div className="hidden lg:flex space-x-6 text-white">
            <a className='link'>Download</a>
            <a className='link'>Why Discord</a>
            <a className='link'>Nitro+</a>
            <a className='link'>Safety</a>
            <a className='link'>Support</a>
        </div>
        <div className='flex space-x-4'>
            <button className='bg-white p-2 rounded-full text-xs md:text-sm px-4 focus:outline-none hover:shadow-2x1 
            hover:text-discord_blurple transition duration-200 ease-in-out whitespace-nowrap font-medium'
            onClick={ !user ? signIn : () => history("/channels")} >
                {!user ? "Login" : "Open Discord"}
            </button>
        </div>
        <MenuIcon className='h-9 cursor-pointer text-white lg:hidden'/>
    </header>
  )
}  

export default Header