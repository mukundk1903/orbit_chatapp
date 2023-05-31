import React, { useEffect, useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../base.js';
import { Navigate } from 'react-router-dom';
import { ChevronDownIcon, CogIcon, MicrophoneIcon, PhoneIcon, PlusIcon } from '@heroicons/react/outline';
import Channels from './Channels.jsx';
import Servers from './Servers.jsx';
import { useCollection } from 'react-firebase-hooks/firestore';
import Chat from './Chat.jsx';
import { selectServerId, selectServerName,setServerInfo } from '../features/serverSlice.jsx';
import { useSelector } from 'react-redux';
import className from 'classnames';
import { storage } from '../base.js';
import AddServerPopup from './AddServerPopup.jsx';
import logo from '../img/orbit cropped.png'
import { useDispatch } from "react-redux";
import { resetChannel, selectChannelId } from "../features/channelSlice.jsx";

function Home() {
  const [user] = useAuthState(auth);
  const [channels, channelsLoading] = useCollection(db.collectionGroup('channels'));
  const [servers, serversLoading] = useCollection(db.collectionGroup('servers'));
  const [users] = useCollection(db.collection('users'));
  const serverId = useSelector(selectServerId);
  const serverName = useSelector(selectServerName)

  const [loading, setLoading] = useState(true);
  const [showAddServerPopup, setShowAddServerPopup] = useState(false);
  const dispatch = useDispatch();
  const channelId = useSelector(selectChannelId);
  console.log(channelId)


  const userId = auth.currentUser?.uid; 

  const handleAddServer = () => {
    setShowAddServerPopup(true);


    // const serverImg = prompt('Channel Image Link');

    // if (serverName) {
    //   db.collection('servers').add({
    //     serverName: serverName,
    //     serverImg: serverImg,
    //   });
    // }
  };

  const handleServerSelect = (serverId, serverName) => {
    dispatch(resetChannel()); // Reset channel state
    dispatch(
      setServerInfo({
        serverId: serverId,
        serverName: serverName,
      })
    );
  };


  const handleAddChannel = () => {
    const channelsName = prompt('Create a New Channel');
    if (channelsName && userId && serverId) {
      db.collection('users')
        .doc(userId)
        .collection('servers')
        .doc(serverId)
        .collection('channels')
        .add({
          UserId: userId,
          serverId: serverId,
          channelId : channelId,
          channelName: channelsName,
        });
    } else {
      console.log('Invalid userId or serverId');
      
    }
  };

  useEffect(() => {
    if (!channelsLoading && !serversLoading) {
      setLoading(false);
    }
  }, [channelsLoading, serversLoading]);

  const selectedServer = servers?.docs.find((doc) => doc.id === serverId);
  const selectedChannels = selectedServer
    ? channels?.docs.filter(
        (doc) => doc.data().serverId === selectedServer.id
      )
    : [];

    const currentUser = users?.docs.find((doc) => doc.id === userId);
    const selectedServers = currentUser 
        ? servers?.docs.filter(
          (doc) => doc.data().UserId === userId
        )
        : [];

        if (!user) {
          return <Navigate to="/" />;
        }
    


  

  return (
    <>
      {!user && <Navigate to="/" />}
      <div className='flex h-screen'>
        <div className='flex flex-col items-center  space-y-6 bg-gray-600 p-3 '>
          <div className='server-Default hover:bg-orbit_white ' >
            <img src={logo}
              alt=""
              className="h-10"
            />
          </div>
          <hr className='border-gray-700 border w-[200px] mx-auto' />
          <div className={className('flex flex-col space-y-2 px-2 mb-4',{
          'animate-pulse': serversLoading, // Apply the pulsing animation if loading
        })}
          >
          
              {selectedServers.map((doc) => (
                <Servers
                  key={doc.id}
                  id={doc.id}
                  serverName={doc.data().serverName}
                  serverImg={doc.data().serverImg}
                />
              ))}
            </div>
          {/* <ServerIcon image="https://editor.analyticsvidhya.com/uploads/81701adidas-nft-bored-ape-810x524.jpg" />
          <ServerIcon image="https://images.barrons.com/im-492408?width=700&height=1050" />
          <ServerIcon image="https://i.pinimg.com/originals/d3/02/e4/d302e4d06d9afae957b686985215270a.jpg" />
          <ServerIcon image="https://img.freepik.com/free-vector/abstract-hand-drawn-woman-portrait-illustrated_23-2148878220.jpg?w=2000" /> */}
          <div className='mx-2 mb-4 w-fit bg-discord_serverBg py-3 px-3 rounded-md flex justify-center
    items-center cursor-pointer transition-all duration-100 ease-out hover:rounded-2xl hover:bg-orbit_green group'>
            <PlusIcon 
            onClick={handleAddServer}
            className='text-orbit_green h-7 group-hover:text-white' 
            />
          </div>
        </div>
        <div className='bg-gray-500 flex flex-col min-w-max'>
          <h2 className='flex text-white font-semibold text-lg tracking-wide  items-center
                justify-between border-b border-gray-800 p-4 hover:bg-discord_serverNameHoverBg cursor-pointer'>
            {serverName}
            <ChevronDownIcon
              className='h-5 ml-2'
            />
          </h2>
          <div className="text-gray-50 flex-grow overflow-y-scroll scrollbar-hide">
        <div className="flex items-center p-2 mb-2">
          <ChevronDownIcon className="h-4 mr-2" />
          <h4 className="font-semibold">Channels</h4>
          <PlusIcon onClick={handleAddChannel} className="h-8 ml-auto cursor-pointer p-1  hover:bg-gray-600 rounded-md" />
        </div>
        <div className="flex flex-col space-y-2 px-2 mb-4">
        {selectedChannels.map((doc) => (
    <Channels
      key={doc.id}
      id={doc.id}
      channelName={doc.data().channelName}
    />
              ))}
</div>
      </div>
          <div className='bg-[#292b2f] flex p-2 justify-between items-center space-x-8'>
              <div className='flex items-center space-x-1 '>
                <img src={auth.currentUser?.photoURL} 
                alt="img" 
                className='h-10 rounded-full'
                onClick={() => auth.signOut()}
                 />
                 <h4 className='text-white text-xs font-medium'>
                  {auth.currentUser?.displayName}
                  <span className='text-[#b9bbbe] block'>
                    #{auth.currentUser?.uid.substring(0, 6)}
                  </span>
                 </h4>
              </div>
              <div className='text-gray-400 flex items-center'>
                <div className='p-2 rounded-md hover:bg-discord_iconHover'>
                  <MicrophoneIcon className='h-6 icon' />
                </div>
                <div className='p-2 rounded-md hover:bg-discord_iconHover'>
                  <PhoneIcon className='h-6 icon' />
                </div>
                <div className='p-2 rounded-md hover:bg-discord_iconHover'>
                  <CogIcon className='h-6 icon' />
                </div>
              </div>
            </div>
    </div>
    <div className='bg-gray-600 flex-grow'>
    <Chat channelId={channelId} />
    </div>
  </div>
  {showAddServerPopup && (
      <AddServerPopup onClose={() => setShowAddServerPopup(false)} />
  )}
</>
);
} 
              
export default Home




