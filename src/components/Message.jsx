import React from 'react'
import moment from 'moment';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../base';
import { TrashIcon } from '@heroicons/react/outline';
import { useSelector } from 'react-redux';
import { selectChannelId } from '../features/channelSlice.jsx';
import { selectServerId } from '../features/serverSlice.jsx';


function Message({id, message,timestamp, name, email, photoURL}) {
  const serverId = useSelector(selectServerId)
    const channelsId = useSelector(selectChannelId);
    const [user] = useAuthState(auth);


  return (
    <div className='flex items-center mx-2 p-1 pl-5 my-4 mr-2 bg-gray-800 hover:bg-discord_blurple rounded-lg group'>
        <img src={photoURL} alt="" className='h-10 rounded-full cursor-pointer mr-3 hover:shadow-2xl' />
        <div className='flex flex-col'>
            <h4 className='flex items-center space-x-2 font-medium'>
                <span className='text-gray-300 hover:underline text-sm cursor-pointer'>{name}</span>
                <span className='text-gray-300 font-thin text-xs'>{moment(timestamp?.toDate().getTime()).format("lll")}</span>
            </h4>
            <p className='text-[18px] overflow-x-hidden max-w-lg h-fit text-white'>{message}</p>
        </div>
        {user?.email === email && (
            <div className='hover:bg-gray-800 p-1 mr-2 ml-auto rounded-sm
             text-white hover:text-white cursor-pointer' 
                onClick={() => 
                db.collection('servers')
                .doc(serverId)
                .collection("channels")
                .doc(channelsId)
                .collection("messages")
                .doc(id)
                .delete()
              }
            >
                <TrashIcon className='h-5 hidden group-hover:inline '/>
            </div>
        )}
    </div> 
  );
}
export default Message;