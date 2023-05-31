import React from 'react'
import {MenuIcon} from "@heroicons/react/outline";
import { useAuthState }  from "react-firebase-hooks/auth";
import {auth, provider} from "../base";
import {useNavigate} from "react-router-dom"
import  logo from '../img/orbit cropped.png';
import { db } from "../base";


function Header() {
    const history = useNavigate();
    const [user] = useAuthState(auth);

    const signIn = (e) => {
  e.preventDefault();
  auth
    .signInWithPopup(provider)
    .then((result) => {
      const user = result.user;
      const userData = {
        userId: user.uid,
        userName: user.displayName,
      };
      console.log(userData)

      // Store user data in Firestore
      db.collection("users")
        .doc(user.uid)
        .set(userData, { merge: true })
        .then(() => {
          history("/users/" + user.uid); // Redirect to create user component
        })
        .catch((error) => {
          alert("Failed to store user data: " + error.message);
        });
    })
    .catch((error) => {
      alert("Failed to sign in: " + error.message);
    });
};


  return (
    <header className='flex items-center justify-between py-4 px-6 bg-orbit_white'>
        <a href="/">
            <img src={logo} 
            alt="orbit" 
            className='w-32 h-12 object-contain'
            />
        </a>
        <div className="hidden lg:flex space-x-6 text-black">
            <a className='link text-black'>Download</a>
            <a className='link text-black' >Why Orbit</a>
            <a className='link text-black'>About Us</a>
            <a className='link text-black'>Safety</a>
            <a className='link text-black'>Support</a>
        </div>
        <div className='flex space-x-4'>
            <button className='bg-discord_blurple p-2 rounded-full text-xs md:text-sm px-10 text-center focus:outline-none hover:shadow-2x1  
            hover:text-gray-100 transition duration-200 ease-in-out whitespace-nowrap font-medium'
            onClick={ !user ? signIn : () => history("/users/" + user.uid)} >
                {!user ? "Login" : "Open Orbit"}
            </button>
        </div>
        <MenuIcon className='h-9 cursor-pointer text-white lg:hidden'/>
    </header>
  )
}  

export default Header