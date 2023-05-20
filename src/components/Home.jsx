import React, { useEffect, useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../base.js';
import { Navigate } from 'react-router-dom';
import { ChevronDownIcon, CogIcon, MicrophoneIcon, PhoneIcon, PlusIcon } from '@heroicons/react/outline';
import Channels from './Channels.jsx';
import Servers from './Servers.jsx';
import { useCollection } from 'react-firebase-hooks/firestore';
import Chat from './Chat.jsx';
import { selectServerId, selectServerName } from '../features/serverSlice.jsx';
import { useSelector } from 'react-redux';
import className from 'classnames';


function Home() {
  const [user] = useAuthState(auth);
  const [channels, channelsLoading] = useCollection(db.collectionGroup('channels'));
  const [servers, serversLoading] = useCollection(db.collection('servers'));
  const serverId = useSelector(selectServerId);
  const serverName = useSelector(selectServerName)
  const [loading, setLoading] = useState(true);

  const handleAddServer = () => {
    const serverName = prompt('Create a new server');
    const serverImg = prompt('Channel Image Link');

    if (serverName) {
      db.collection('servers').add({
        serverName: serverName,
        serverImg: serverImg,
      });
    }
  };

  const handleAddChannel = () => {
    const channelsName = prompt('Create a New Channel');

    if (channelsName) {
      db.collection('servers')
        .doc(serverId)
        .collection('channels')
        .add({
          serverId: serverId,
          channelName: channelsName,
        });
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

    


  

  return (
    <>
      {!user && <Navigate to="/" />}
      <div className='flex h-screen'>
        <div className='flex flex-col space-y-3 bg-discord_serversBg p-3 min-w-max'>
          <div className='server-Default hover:bg-discord_purple ' >
            <img src="https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6cc3c481a15a141738_icon_clyde_white_RGB.png"
              alt=""
              className="h-5"
            />
          </div>
          <hr className='border-gray-700 border w-8 mx-auto' />
          <div className={className('flex flex-col space-y-2 px-2 mb-4',{
          'animate-pulse': serversLoading, // Apply the pulsing animation if loading
        })}
          >
          
              {servers?.docs.map((doc) => (
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
          <div className='mx-2 mb-4 server-Default hover:bg-discord_green group'>
            <PlusIcon 
            onClick={handleAddServer}
            className='text-discord_green h-7 group-hover:text-white' 
            />
          </div>
        </div>
        <div className='bg-discord_channelsBg flex flex-col min-w-max'>
          <h2 className='flex text-white font-bold text-sm items-center
                justify-between border-b border-gray-800 p-4 hover:bg-discord_serverNameHoverBg cursor-pointer'>
            {serverName}
            <ChevronDownIcon
              className='h-5 ml-2'
            />
          </h2>
          <div className="text-discord_channel flex-grow overflow-y-scroll scrollbar-hide">
        <div className="flex items-center p-2 mb-2">
          <ChevronDownIcon className="h-3 mr-2" />
          <h4 className="font-semibold">Channels</h4>
          <PlusIcon onClick={handleAddChannel} className="h-6 ml-auto cursor-pointer hover:text-white" />
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
                alt="" 
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
    <div className='bg-[#36393f] flex-grow'>
      <Chat />
    </div>
  </div>
</>
);
} 
              
export default Home




