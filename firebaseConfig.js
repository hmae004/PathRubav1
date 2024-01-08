// ./services/firebase.js
import { initializeApp, getApp } from "firebase/app";
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyDbjNQ84j5OaGDeOOpu-kZ-81P92JWIrfw",
    authDomain: "pathruba-896b7.firebaseapp.com",
    projectId: "pathruba-896b7",
    storageBucket: "pathruba-896b7.appspot.com",
    messagingSenderId: "253489985107",
    appId: "1:253489985107:web:0c5bc385f0ff488fc738a6"
};

// initialize Firebase App
const app = initializeApp(firebaseConfig);
// initialize Firebase Auth for that app immediately
initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export {app};