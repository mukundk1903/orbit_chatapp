import React, { useState } from 'react';
import { auth,db } from '../base.js';
import firebase from 'firebase/compat/app';

function JoinServerPopup({ setShowJoinServerPopup }) {
  const [serverName, setServerName] = useState('');
  const [passcode, setPasscode] = useState('');
  const userId = auth.currentUser?.uid;

  const handleJoinServer = () => {
    if (serverName && passcode) {
      db.collection('servers')
        .where('serverName', '==', serverName)
        .where('serverCode', '==', passcode)
        .get()
        .then((querySnapshot) => {
          if (!querySnapshot.empty) {
            const serverDoc = querySnapshot.docs[0];
            const serverId = serverDoc.id;

            serverDoc.ref.update({
              Participants: firebase.firestore.FieldValue.arrayUnion(userId)
            })

            // Perform any additional operations with the server document

            console.log('Server found:');
            setShowJoinServerPopup(false);
          } else {
            console.log('No matching server found');
          }
        })
        .catch((error) => {
          console.log('Error joining server:', error);
        });
    }
  };  

  return (
    <div className="fixed z-10 inset-0 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <div className="relative w-96 bg-white rounded-md shadow-lg">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Join Server</h3>
          <button onClick={() => setShowJoinServerPopup(false)} className="p-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-500 hover:text-gray-700 cursor-pointer"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4">
          <input
            type="text"
            placeholder="Enter Server Name"
            value={serverName}
            onChange={(e) => setServerName(e.target.value)}
            className="w-full border-gray-300 border rounded-md px-3 py-2 outline-none focus:border-blue-500"
          />
          <input
            type="password"
            placeholder="Enter Passcode"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            className="w-full mt-4 border-gray-300 border rounded-md px-3 py-2 outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex justify-end items-center p-4">
          <button
            onClick={handleJoinServer}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-md"
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
}

export default JoinServerPopup;
