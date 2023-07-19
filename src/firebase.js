import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCq1tQfxNqph9lcHbCp02EJIRCPDlKTXj4",
    authDomain: "get-a-bus-79ebf.firebaseapp.com",
    projectId: "get-a-bus-79ebf",
    storageBucket: "get-a-bus-79ebf.appspot.com",
    messagingSenderId: "400431792499",
    appId: "1:400431792499:web:fb5211ecdbc854e7384506",
    measurementId: "G-61B99KQPX7"
  };

  const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };