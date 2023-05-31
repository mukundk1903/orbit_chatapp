import { HashtagIcon } from '@heroicons/react/outline';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setChannelInfo } from '../features/channelSlice.jsx';
import { selectServerId } from '../features/serverSlice.jsx';
import {auth} from "../base";
import { useAuthState }  from "react-firebase-hooks/auth";



function Channels({id,channelName}) {
  const serverId = useSelector(selectServerId)
  const dispatch = useDispatch();
  const history = useNavigate();
  const [user] = useAuthState(auth);
  const userId = user.uid;
  const setChannel = () => {
    dispatch(
      setChannelInfo({
        userId: userId,
        serverId: serverId,
        channelsId: id,
        channelName:channelName,
    })
  );
  history("/users/" + userId + '/servers/' + serverId + '/channels/' + id );
  };


  return (
    <div className='font-medium flex items-center cursor-pointer
    hover:bg-discord_channelHoverBg p-1 rounded-md hover:text-white'
    onClick={setChannel}
    >
      <HashtagIcon className='h-5 mr-2' />
      <span>{channelName}</span> 
    </div>
  )
}

export default Channels;