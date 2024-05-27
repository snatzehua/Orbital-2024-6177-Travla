// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA_MRoavAt4b3mNWhmsC80aUYFRm86XsWg",
  authDomain: "travla-a85e6.firebaseapp.com",
  databaseURL: "https://travla-a85e6-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "travla-a85e6",
  storageBucket: "travla-a85e6.appspot.com",
  messagingSenderId: "589456840073",
  appId: "1:589456840073:web:bdedf281bf2249cd4a7d58",
  measurementId: "G-9MBW88FC4R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);