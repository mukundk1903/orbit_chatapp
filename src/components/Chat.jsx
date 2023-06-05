import { BellIcon, ChatIcon, EmojiHappyIcon, GiftIcon, HashtagIcon, InboxIcon, PlusCircleIcon, QuestionMarkCircleIcon, SearchIcon, ShareIcon, UsersIcon } from '@heroicons/react/outline';
import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../base.js';
import { useRef } from 'react';
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';
import firebase from 'firebase/compat/app'; 
import Message from './Message.jsx';
import { selectServerId } from '../features/serverSlice.jsx';
import { useSelector } from "react-redux";
import { selectChannelId, selectChannelName } from "../features/channelSlice";
import ShareServerPopup from './ShareServerPopup.jsx';

function Chat() {
  const serverId = useSelector(selectServerId);
  const channelId = useSelector(selectChannelId);
  const channelName = useSelector(selectChannelName);
  const [user] = useAuthState(auth);
  const [channels, channelsLoading] = useCollection(db.collectionGroup('channels'));
  const [servers, serversLoading] = useCollection(db.collectionGroup('servers'));
  const [users] = useCollection(db.collection('users'));
  const userId = auth.currentUser?.uid;
  const [messages, loading] = useCollection(
    channelId &&
    db
      .collection("servers")
      .doc(serverId)
      .collection("channels")
      .doc(channelId)
      .collection("messages")
      .orderBy("timestamp", "asc")
  );
  const inputRef = useRef("");
  const chatRef = useRef(null);
  const [showShareServerPopup, setShowShareServerPopup] = useState(false);

  const scrollToBottom = () => {
    chatRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleShareServer = () => {
    setShowShareServerPopup(true);
  };

  const sendMessage = (e) => {
    e.preventDefault();

    if (inputRef.current.value !== "") {
      db
        .collection('servers')
        .doc(serverId)
        .collection("channels")
        .doc(channelId)
        .collection("messages")
        .add({
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          message: inputRef.current.value,
          name: user?.displayName,
          photoURL: user?.photoURL,
          email: user?.email,
        });
    }
    inputRef.current.value = "";
    scrollToBottom();
  };

  // Check if the current user is the admin
  const isAdmin = servers?.docs.some(
    (doc) => doc.id === serverId && doc.data().UserId === userId
  );

  return (
    <div className='flex flex-col h-screen'>
      <header className='flex items-center justify-between space-x-5 border-b border-gray-800 p-4 -mt-1'>
        <div className='flex items-center space-x-1'>
          <HashtagIcon className='h-6 text-white' />
          <h4 className='text-slate-100 text-md font-semibold'>{channelName}</h4>
        </div>
        <div className='flex space-x-3'>
          <BellIcon className=' h-6 text-gray-400' />
          <ChatIcon className='h-6 text-gray-400' />
          <UsersIcon className='h-6 text-gray-400' />
          <div className='flex bg-[#202225] text-xs p-1 rounded-md'>
            <input
              type="text"
              placeholder='Search'
              className='bg-transparent focus:outline-none text-white pl-1 rounded-md'
            />
            <SearchIcon className='h-4 text-[#4f4f4f] mr-1' />
          </div>
          <InboxIcon className='h-6 text-gray-400 ' />
          <QuestionMarkCircleIcon className='h-6 text-gray-400 ' />
          <ShareIcon
  className={`h-6 text-gray-400 hover:text-white ${
    isAdmin ? '' : 'hidden'
  }`}
  onClick={handleShareServer}
/>
        </div>
      </header>
      <main className='flex-grow overflow-y-scroll scrollbar-hide '>
        {messages?.docs.map((doc) => {
          const { message, timestamp, name, photoURL, email } = doc.data();
          return (
            <Message
              key={doc.id}
              id={doc.id}
              message={message}
              timestamp={timestamp}
              name={name}
              email={email}
              photoURL={photoURL}
            />
          );
        })}
        <div ref={chatRef} className='pb-16' />
      </main>
      <div className='bg-slate-600'>
        <div className='flex items-center mt-3 p-2.5   bg-discord_purple mx-5 mb-7 rounded-lg'>
          <PlusCircleIcon className='icon mr-4' />
          <form className='flex-grow'>
            <input
              type="text"
              disabled={!channelId}
              placeholder={channelId ? "Message #" + channelName : "Select a Channel"}
              className='bg-transparent focus:outline-none 
                    text-white w-full placeholder-white
                    text-md'
              ref={inputRef}
            />
            <button hidden type='submit' onClick={sendMessage}>
              send
            </button>
          </form>
          <GiftIcon className='icon mr-2' />
          <EmojiHappyIcon className='icon' />
        </div>
      </div>

      {showShareServerPopup && (
        <ShareServerPopup serverName={channelName} />
      )}
    </div>
  );
}

export default Chat;
