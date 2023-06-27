import React, { useEffect, useState } from 'react';
import logo from '../img/orbit cropped.png';
import { useSelector } from 'react-redux';
import { selectServerId, selectServerName } from '../features/serverSlice.jsx';
import { db, storage } from '../base.js';
import Post from './Post.jsx';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../base.js';
import firebase from 'firebase/compat/app';
import { useCollection, useCollectionData } from 'react-firebase-hooks/firestore';

function Feed({ setShowOpenFeed }) {
  const [user] = useAuthState(auth);
  const userId = auth.currentUser?.uid;
  const serverId = useSelector(selectServerId);
  const [serverImg, setServerImg] = useState('');
  const serverName = useSelector(selectServerName);
  const [postImage, setPostImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [isPostSuccessful, setIsPostSuccessful] = useState(false);
  const [posts, setPosts] = useState([]);
  const [servers, serversLoading] = useCollection(db.collectionGroup('servers'));
  const isAdmin = servers?.docs.some(
    (doc) => doc.id === serverId && doc.data().UserId === userId
  );

  useEffect(() => {
    // Retrieve the server img from Firebase
    db.collection('servers')
      .doc(serverId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const data = doc.data();
          setServerImg(data.serverImg);
        }
      })
      .catch((error) => {
        console.log('Error retrieving server image', error);
      });
  }, [serverId]);

  useEffect(() => {
    // Retrieve the posts from Firebase
    db.collection('servers')
      .doc(serverId)
      .collection('feed')
      .orderBy('timestamp', 'desc') // Order posts by timestamp in descending order
      .get()
      .then((snapshot) => {
        const fetchedPosts = [];
        snapshot.forEach((doc) => {
          const postData = doc.data();
          const post = {
            postId: doc.id,
            postImg: postData.postImg,
            postCaption: postData.postCaption,
            timestamp: postData.timestamp?.toDate().toLocaleString(), // Convert timestamp to a JavaScript Date object
          };
          fetchedPosts.push(post);
        });
        setPosts(fetchedPosts);
      })
      .catch((error) => {
        console.log('Error retrieving posts', error);
      });
  }, [serverId]);

  const handleCloseClick = () => {
    setShowOpenFeed(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setPostImage(file);
  };

  const handleCaptionChange = (e) => {
    setCaption(e.target.value);
  };

  const handleSubmit = () => {
    // Upload the post image to Firebase Storage
    const storageRef = storage.ref();
    const imageRef = storageRef.child(`post_images/${postImage.name}`);
    imageRef
      .put(postImage)
      .then((snapshot) => {
        // Get the download URL of the uploaded image
        snapshot.ref
          .getDownloadURL()
          .then((downloadURL) => {
            // Create a new post document in the 'feed' collection
            db.collection('servers')
              .doc(serverId)
              .collection('feed')
              .add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                adminId: user?.displayName,
                postCaption: caption,
                postImg: downloadURL,
              })
              .then(() => {
                // Reset the form and show the post success popup
                setPostImage(null);
                setCaption('');
                setIsPostSuccessful(true);
              })
              .catch((error) => {
                console.log('Error adding post to feed', error);
              });
          })
          .catch((error) => {
            console.log('Error getting download URL', error);
          });
      })
      .catch((error) => {
        console.log('Error uploading post image', error);
      });
  };

  return (
    <div className='fixed top-0 left-0 w-[39vw] flex-col h-screen flex bg-gray-900 bg-opacity-2'>
      <div className='bg-white w-full top-0 h-14 p-5 flex items-center flex-row justify-between'>
        <div>
          <img src={logo} alt="orbit" className="h-8" />
        </div>
        <div className='flex flex-row items-center w-[75%] justify-end'>
          <div className='mr-2 mb-2'>
            <p className='text-lg font-semibold mt-2 underline text-discord_channelsBg'>{serverName}</p>
          </div>
          <img src={serverImg} className='mr-2 h-12 w-12 rounded-full' alt="server" />
          <div>
          </div>
          <div className='mr-2 p-2 bg-discord_channelHoverBg rounded-lg'>
            <p className='text-md text-discord_blurple font-sans  font-thin'>Feed</p>
          </div>
          <div>
            <button className="share-button bg-blue-500 text-xl text-white py-2 px-4 rounded-xl hover:rounded-full" onClick={handleCloseClick}>
              X
            </button>
          </div>
        </div>
      </div>

      <div className={`p-2 h-[140px] flex flex-col justify-between bg-gray-400 ${isAdmin ? '' : 'hidden'}`}>
        <input className='rounded-md bg-discord_iconHover text-white focus:outline-none p-1' type="text" value={caption} onChange={handleCaptionChange} placeholder="Enter caption" />

        <label className="block text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Upload file</label>
        <input type="file" className='block w-full text-sm text-gray-900 border-0 border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400' onChange={handleImageChange} />

        <button className="bg-orbit_green text-white py-2 px-4 rounded-lg" onClick={handleSubmit}>Post to Feed</button>
      </div>

      {isPostSuccessful && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-md shadow-md">
          <p className="text-lg font-semibold text-gray-800">Post submitted successfully!</p>
          <button className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-4" onClick={() => setIsPostSuccessful(false)}>Close</button>
        </div>
      )}

      <div className='max-h w-auto flex flex-col items-center overflow-y-auto p-8 scrollbar-hide'>
        {posts.map((post) => (
          <Post key={post.postId} timestamp={post.timestamp} postImg={post.postImg} postCaption={post.postCaption} />
        ))}
      </div>

    </div>
  );
}

export default Feed;
