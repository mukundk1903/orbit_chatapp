import { HashtagIcon } from '@heroicons/react/outline';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setChannelInfo } from '../features/channelSlice.jsx';
import { selectServerId } from '../features/serverSlice.jsx';



function Channels({id,channelName}) {
  const serverId = useSelector(selectServerId)
  const dispatch = useDispatch();
  const history = useNavigate();

  const setChannel = () => {
    dispatch(
      setChannelInfo({
        serverId: serverId,
        channelsId: id,
        channelName:channelName,
    })
  );
  history( '/servers/' + serverId + '/channels/' + id );
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