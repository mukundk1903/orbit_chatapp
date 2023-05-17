import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBNECl0JOHe_cgDvcBv62YMyAjNCqLsUqk",
    authDomain: "orbit-chat-61003.firebaseapp.com",
    projectId: "orbit-chat-61003",
    storageBucket: "orbit-chat-61003.appspot.com",
    messagingSenderId: "1093914581525",
    appId: "1:1093914581525:web:63b14852f11b60b1fb0c1c"
  };

  const app = firebase.initializeApp(firebaseConfig);

  const db = app.firestore();
  const auth = firebase.auth();
  const provider = new firebase.auth.GoogleAuthProvider();

  export {auth, provider, db};