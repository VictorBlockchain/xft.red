import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyC_3kJxqMbf6spgrRpqWmJ9xquVcOTX3WA",
    authDomain: "nftea-5cc10.firebaseapp.com",
    projectId: "nftea-5cc10",
    storageBucket: "nftea-5cc10.appspot.com",
    messagingSenderId: "655838536356",
    appId: "1:655838536356:web:2c3f8560fb3c9a7d0b3c31",
    measurementId: "G-PYWLXH7C2J"
  };
  
  const fbase = initializeApp(firebaseConfig);
  const db = getFirestore(fbase);
  
  let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(fbase);
}
  
  // const analytics = getAnalytics(app);
  export  { fbase, analytics, db };
