import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setServerInfo } from '../features/serverSlice.jsx';
import {auth} from "../base";
import { useAuthState }  from "react-firebase-hooks/auth";
import { resetChannelInfo } from '../features/channelSlice.jsx';

import React from 'react'

function Servers({id,serverName,serverImg,}){
    const dispatch = useDispatch();
    const history = useNavigate();
    const [user] = useAuthState(auth);
    const userId = user.uid;

    const setServer = () => {
        dispatch(
          setServerInfo({
            userId: userId,
            serverId: id,
            serverName: serverName,
            serverImg: serverImg,
          })
        );
        dispatch(resetChannelInfo());
        history("/users/" + userId + '/servers/' + id);
    };
    return (
        <div
         className='h-[12] w-27 py-2 px-5 flex flex-row bg-gray-400 cursor-pointer rounded-lg transition-all duration-100
         ease-out hover:rounded-2xl' onClick={setServer}
        >
            <img src={serverImg} alt=""  className='h-12 w-12  object-cover cursor-pointer rounded-md transition-all duration-400
         ease-out hover:rounded-2xl'  />
         <p className=' text-black  font-semibold w-[170px] rounded-lg px-2 py-3 hover:rounded-2xl'>{serverName}</p>
        </div>
      )
    }

export default Servers;