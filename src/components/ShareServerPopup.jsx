import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectServerId, selectServerName } from '../features/serverSlice.jsx';
import { auth, db } from '../base.js';

const ShareServerPopup = () => {
  const serverId = useSelector(selectServerId);
  const serverName = useSelector(selectServerName);
  const [serverCode, setServerCode] = useState('');
  const userId = auth.currentUser?.uid;
  const [isPopupOpen, setIsPopupOpen] = useState(true); // State variable to manage popup visibility

  useEffect(() => {
    // Retrieve the server code from Firebase
    db
      .collection('servers')
      .doc(serverId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const data = doc.data();
          setServerCode(data.serverCode);
        }
      })
      .catch((error) => {
        console.log('Error retrieving server code:', error);
      });
  }, [serverId]);

  const handleCloseClick = () => {
    setIsPopupOpen(false);
  };

  return (
    <>
      {isPopupOpen && ( // Render the popup only if isPopupOpen is true
        <div className="absolute top-0 left-0 w-screen h-screen flex justify-center items-center bg-gray-900 bg-opacity-50">
          <div className="bg-gray-400 py-10 px-[150px] rounded-md">
            <h3 className="server-name text-lg font-bold mb-2 text-black">Server Name: {serverName}</h3>
            <p className="server-code text-sm mb-4 text-black">Server Passcode: {serverCode}</p>
            <button className="share-button bg-blue-500 text-white py-2 px-4 rounded-md" onClick={handleCloseClick}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ShareServerPopup;
