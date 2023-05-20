import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setServerInfo } from '../features/serverSlice.jsx';

import React from 'react'

function Servers({id,serverName,serverImg}){
    const dispatch = useDispatch();
    const history = useNavigate();

    const setServer = () => {
        dispatch(
            setServerInfo({
                serverId: id,
                serverName: serverName,
                serverImg: serverImg,
            })
        );
        history('/servers/' + id);
    };
    return (
        <div
         className='h-12 w-12  object-cover cursor-pointer rounded-full transition-all duration-100
         ease-out hover:rounded-2xl' onClick={setServer}
        >
            <img src={serverImg} alt=""  className='h-12 w-12  object-cover cursor-pointer rounded-full transition-all duration-400
         ease-out hover:rounded-2xl'  />
        </div>
      )
    }

export default Servers;