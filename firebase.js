import * as firebase from "firebase";
require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyCvhqM8MsiPRQ1-UWVpkqiRzwz9nLVB8qY",
  authDomain: "talkifyy-43429.firebaseapp.com",
  databaseURL: "https://talkifyy-43429.firebaseio.com",
  projectId: "talkifyy-43429",
  storageBucket: "talkifyy-43429.appspot.com",
  messagingSenderId: "21881755918",
  appId: "1:21881755918:web:342c1ecb217875b9e11f5f",
  measurementId: "G-DP07M44DLE"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export default firebase;
