import React, { useState } from 'react';
import { db, storage } from '../base.js';

function AddServerPopup({ onClose }) {
  const [serverName, setServerName] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const handleServerNameChange = (e) => {
    setServerName(e.target.value);
  };

  const handleImageFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleAddServer = () => {
    // Create a new server document in Firestore
    const newServerRef = db.collection('servers').doc();
    const newServerId = newServerRef.id;

    // Upload the image file to Firebase Storage
    const imageRef = storage.ref(`serverImages/${newServerId}`).child(imageFile.name);
    const uploadTask = imageRef.put(imageFile);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Progress monitoring if needed
      },
      (error) => {
        console.error('Error uploading image:', error);
      },
      () => {
        // Image upload completed successfully
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          // Store the server data in Firestore
          newServerRef.set({
            serverName: serverName,
            serverImg: downloadURL,
          });
        });
      }
    );

    // Close the popup
    onClose();
  };

  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center bg-gray-900 bg-opacity-50">
      <div className="bg-slate-500 p-4 rounded shadow">
        <h2 className="text-lg font-bold mb-4">Create a new server</h2>
        <div className="mb-4">
          <label htmlFor="serverName" className="block text-sm font-medium text-gray-100 pb-2">
            Server Name
          </label>
          <input
            type="text"
            id="serverName"
            className="w-full border-gray-800 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 p-1"
            value={serverName}
            onChange={handleServerNameChange}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="imageFile" className="pb-2 block text-sm font-medium text-gray-100 text-gray-700">
            Server Image
          </label>
          <input
            type="file"
            id="imageFile"
            accept="image/*"
            className="border-gray-300"
            onChange={handleImageFileChange}
          />
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-700 rounded shadow-sm mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-500 rounded shadow-sm"
            onClick={handleAddServer}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddServerPopup;