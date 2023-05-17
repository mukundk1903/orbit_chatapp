import React from 'react'
import moment from 'moment';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../base';
import { TrashIcon } from '@heroicons/react/outline';
import { useSelector } from 'react-redux';
import { selectChannelId } from '../features/channelSlice.jsx';


function Message({id, message,timestamp, name, email, photoURL}) {
    const channelId = useSelector(selectChannelId);
    const [user] = useAuthState(auth);


  return (
    <div className='flex items-center mx-2 p-1 pl-5 my-4 mr-2 hover:bg-[#32353b] rounded-lg group'>
        <img src={photoURL} alt="" className='h-10 rounded-full cursor-pointer mr-3 hover:shadow-2xl' />
        <div className='flex flex-col'>
            <h4 className='flex items-center space-x-2 font-medium'>
                <span className='text-white hover:underline text-sm cursor-pointer'>{name}</span>
                <span className='text-[#72767d] text-xs'>{moment(timestamp?.toDate().getTime()).format("lll")}</span>
            </h4>
            <p className='text-sm text-[#dcddde]'>{message}</p>
        </div>
        {user?.email === email && (
            <div className='hover:bg-[#852522ae] p-1 ml-auto rounded-sm
             text-[#852622ae] hover:text-white cursor-pointer' 
                onClick={() => 
                db
                .collection("channels")
                .doc(channelId)
                .collection("message")
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