import { BellIcon, ChatIcon, EmojiHappyIcon, GiftIcon, HashtagIcon, InboxIcon, PlusCircleIcon, QuestionMarkCircleIcon, SearchIcon, UsersIcon } from '@heroicons/react/outline';
import React from 'react'
import { useSelector } from 'react-redux';
import { selectChannelId, selectChannelName } from '../features/channelSlice.jsx';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../base.js';
import { useRef } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import firebase from 'firebase/compat/app'; 
import Message from './Message.jsx';



function Chat() {
    const channelsId = useSelector(selectChannelId); 
    const channelName = useSelector(selectChannelName); 
    const [user] = useAuthState(auth);
    const [messages] = useCollection(
        channelsId && 
        db
        .collection("channels")
        .doc(channelsId)
        .collection("messages")
        .orderBy("timestamp","asc")
        );
    const inputRef = useRef("");
    const chatRef = useRef(null);

    const scrollToBottom = () => {
        chatRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    const sendMessage = (e) =>{
        e.preventDefault();

        if (inputRef.current.value !== ""){
            db.collection("channels").doc(channelsId).collection("messages").add({
                timestamp:firebase.firestore.FieldValue.serverTimestamp(),
                message: inputRef.current.value,
                name: user?.displayName,
                photoURL: user?.photoURL,
                email: user?.email,
            })
        }
        inputRef.current.value = "";
        scrollToBottom();
    }

  return (
    <div className='flex flex-col h-screen'>
        <header 
        className='flex items-center justify-between space-x-5 border-b border-gray-800 p-4 -mt-1'>
            <div className='flex items-center space-x-1'>
                <HashtagIcon className='h-6 text-[#72767d]' />
                <h4 className='text-white font-semibold'>{channelName}</h4>
            </div>
            <div className='flex space-x-3'>
                <BellIcon className=' h-6 text-discord_chatHeaderIcon'/>
                <ChatIcon className='h-6 text-discord_chatHeaderIcon'/>
                <UsersIcon className='h-6 text-discord_chatHeaderIcon'/>
                <div className='flex bg-[#202225] text-xs p-1 rounded-md'>
                    <input 
                    type="text" 
                    placeholder='Search' 
                    className='bg-transparent focus:outline-none text-white pl-1 rounded-md' 
                    />
                    <SearchIcon className='h-4 text-[#4f4f4f] mr-1'/>
                </div>
                <InboxIcon className='h-6 text-discord_chatHeaderIcon '/>
                <QuestionMarkCircleIcon className='h-6 text-discord_chatHeaderIcon '/>
            </div>
        </header>
        <main className='flex-grow overflow-y-scroll scrollbar-hide '>
            {messages?.docs.map((doc) => {
                const {message, timestamp, name, photoURL, email} = doc.data();
                return (
                    <Message 
                    key={doc.id} 
                    id={doc.id} 
                    message = {message} 
                    timestamp = {timestamp} 
                    name={name} 
                    email={email} 
                    photoURL = {photoURL}
                    />
                );
            })}
            <div ref={chatRef} className='pb-16'/>
        </main>
            <div className='flex items-center p-2.5 bg-discord_chatInputBg mx-5 mb-7 rounded-lg'>
                <PlusCircleIcon className='icon mr-4'/>
                <form className='flex-grow'>
                    <input 
                    type="text" 
                    disabled={!channelsId} 
                    placeholder={
                        channelsId?"Message #" + channelName : "Select a Channel" 
                    }
                    className='bg-transparent focus:outline-none 
                    text-discord_chatInputText w-full placeholder-discord_chatInput
                    text-sm' 
                    ref={inputRef}
                    />
                    <button hidden type='submit' onClick={sendMessage}>
                        send
                    </button>
                </form>
                <GiftIcon className='icon mr-2'/>
                <EmojiHappyIcon className='icon'/>
            </div>
        
    </div>
  );
}

export default Chat