import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../base.js';
import { Navigate } from 'react-router-dom';
import { ChevronDownIcon, CogIcon, MicrophoneIcon, PhoneIcon, PlusIcon } from '@heroicons/react/outline';
import Channels from './Channels.jsx';
import Servers from './Servers.jsx';
import { useCollection } from 'react-firebase-hooks/firestore';
import Chat from './Chat.jsx';
import { selectServerId, selectServerImg, selectServerName, setServerInfo } from '../features/serverSlice.jsx';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';
import { resetChannel, selectChannelId } from '../features/channelSlice.jsx';
import AddServerPopup from './AddServerPopup.jsx';
import JoinServerPopup from './JoinServerPopup.jsx';
import logo from '../img/orbit cropped.png';
import Feed from './Feed.jsx';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [channels, channelsLoading] = useCollection(db.collectionGroup('channels'));
  const [servers, serversLoading] = useCollection(db.collectionGroup('servers'));
  const serverId = useSelector(selectServerId);
  const serverName = useSelector(selectServerName);
  const serverImg = useSelector(selectServerImg);
  const [loading, setLoading] = useState(true);
  const [showJoinServerPopup, setShowJoinServerPopup] = useState(false);
  const [showAddServerPopup, setShowAddServerPopup] = useState(false);
  const [showOpenFeed, setShowOpenFeed] = useState(false);
  const dispatch = useDispatch();
  const channelId = useSelector(selectChannelId);

  const userId = auth.currentUser?.uid;

  const handleAddServer = () => {
    setShowAddServerPopup(true);
  };

  const handleopenFeed = () =>{
    setShowOpenFeed(true);
  } 

  const handleClose = () => {
    setShowOpenFeed(false);
    setShowAddServerPopup(false);
    setShowJoinServerPopup(false);
  };

  const handleJoinServer = () => {
    setShowJoinServerPopup(true);
  };

  
  const handleServerSelect = (serverId, serverName) => {
    dispatch(resetChannel());
    dispatch(
      setServerInfo({
        serverId: serverId,
        serverName: serverName,
        serverImg: serverImg
      })
    );
  };

  const handleAddChannel = () => {
    if (userId && serverId) {
      // Check if the current user is the admin of the server
      const isAdmin = selectedServer && selectedServer.data().UserId === userId;
  
      // If the user is the admin, prompt for a new channel name
      if (isAdmin) {
        const channelName = prompt('Create a New Channel');
        if (channelName) {
          db.collection('servers')
            .doc(serverId)
            .collection('channels')
            .add({
              UserId: userId,
              serverId: serverId,
              channelId: channelId,
              channelName: channelName,
            });
        } else {
          console.log('Invalid channel name');
        }
      } else {
        console.log('Only the admin can add channels');
      }
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
  const selectedChannels = selectedServer ? channels?.docs.filter((doc) => doc.data().serverId === selectedServer.id) : [];
  const filteredServers = servers?.docs.filter((doc) =>  doc.data().UserId === userId);

  const participantServers = servers?.docs.filter((doc) => {
    const participants = doc.data().Participants;
    return participants && Array.isArray(participants) && participants.includes(userId);
  });
  
  console.log(participantServers);

  if (!user) {
    return <Navigate to="/" />;
  };

  

  return (
    <>
      {!user && <Navigate to="/" />}
      <div className="flex h-screen">
        <div className="flex flex-col items-center space-y-6 bg-gray-600 p-3">
          <div className="server-Default hover:bg-orbit_white">
            <img src={logo} alt="" className="h-10" />
          </div>
          <hr className="border-gray-700 border w-[200px] mx-auto" />
          
          <div className={classNames('flex flex-col space-y-2 px-2 mb-4', {'animate-pulse': serversLoading,})}>
              <div className=" mb-4 w-full justify-between items-center bg-discord_serverBg py-2 px-4 rounded-md flex flex-row  cursor-pointer ">
                  <h3 className="text-gray-300 text-md font-medium">Your Servers</h3>
                  <PlusIcon onClick={handleAddServer} className="text-orbit_green h-7 transition-all duration-100 ease-out hover:rounded-2xl hover:bg-white group group-hover:text-white" />
              </div>
              {filteredServers && filteredServers.map((doc) => (
                <Servers key={doc.id} id={doc.id} serverName={doc.data().serverName} serverImg={doc.data().serverImg} />
              ))}
               <hr className="border-gray-700 border w-full mx-auto" />
              <div className=" mb-4 w-full justify-between items-center bg-discord_serverBg py-2 px-4 rounded-md flex flex-row  cursor-pointer ">
                <h3 className="text-gray-300 text-md font-medium">Joined Servers</h3>  
                <PlusIcon onClick={handleJoinServer} className="text-orbit_green h-7 transition-all duration-100 ease-out hover:rounded-2xl hover:bg-white group group-hover:text-white" />
              </div>
              {participantServers && participantServers.map((doc) => (
                <Servers key={doc.id} id={doc.id} serverName={doc.data().serverName} serverImg={doc.data().serverImg} />
              ))}
          </div>
          
          
        </div>
        <div className="bg-gray-500 flex flex-col min-w-max">
          <h2 className="flex text-white font-semibold text-lg tracking-wide items-center justify-between border-b border-gray-800 p-4 hover:bg-discord_serverNameHoverBg cursor-pointer">
            {serverName}
            {serverId && <ChevronDownIcon
             onClick={handleopenFeed}
             className="h-5 ml-2" />}
          </h2>
          <div className="text-gray-50 flex-grow overflow-y-scroll scrollbar-hide">
            <div className="flex items-center p-2 mb-2">
              <ChevronDownIcon className="h-4 mr-2" />
              <h4 className="font-semibold">Channels</h4>
              {selectedServer && selectedServer.data().UserId === userId && (
                <PlusIcon
                onClick={handleAddChannel}
                className="h-8 ml-auto cursor-pointer p-1 hover:bg-gray-600 rounded-md"
                />)}
            </div>
            <div className="flex flex-col space-y-2 px-2 mb-4">
              {selectedChannels.map((doc) => (
                <Channels key={doc.id} id={doc.id} channelName={doc.data().channelName} />
              ))}
            </div>
          </div>
          <div className="bg-[#292b2f] flex p-2 justify-between items-center space-x-8">
            <div className="flex items-center space-x-1">
              <img
                src={auth.currentUser?.photoURL}
                alt="img"
                className="h-10 rounded-full"
                onClick={() => auth.signOut()}
              />
              <h4 className="text-white text-xs font-medium">
                {auth.currentUser?.displayName}
                <span className="text-[#b9bbbe] block">#{auth.currentUser?.uid.substring(0, 6)}</span>
              </h4>
            </div>
            <div className="text-gray-400 flex items-center">
              <div className="p-2 rounded-md hover:bg-discord_iconHover">
                <MicrophoneIcon className="h-6 icon" />
              </div>
              <div className="p-2 rounded-md hover:bg-discord_iconHover">
                <PhoneIcon className="h-6 icon" />
              </div>
              <div className="p-2 rounded-md hover:bg-discord_iconHover">
                <CogIcon className="h-6 icon" />
              </div>
            </div>
          </div>
        </div>
        <div className='bg-gray-600 flex-grow'>
    <Chat channelId={channelId} />
    </div>
      </div>
      
      {showOpenFeed && <Feed setShowOpenFeed={setShowOpenFeed} onClose={handleClose} />}
      {showAddServerPopup && <AddServerPopup setShowAddServerPopup={setShowAddServerPopup} onClose={handleClose} />}
      {showJoinServerPopup && <JoinServerPopup setShowJoinServerPopup={setShowJoinServerPopup} onClose={handleClose}/>}
    </>
  );
}

export default Home;
