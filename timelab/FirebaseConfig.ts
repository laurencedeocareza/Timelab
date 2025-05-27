// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBV8ZiFBHKlERgVlAJvCz9C6ZH7RCDBRqU",
  authDomain: "timelab-20c2d.firebaseapp.com",
  projectId: "timelab-20c2d",
  storageBucket: "timelab-20c2d.firebasestorage.app",
  messagingSenderId: "1015767007047",
  appId: "1:1015767007047:web:8993ec563004329ad61662",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const db = getFirestore(app);
