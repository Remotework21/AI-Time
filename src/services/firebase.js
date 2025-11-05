// src/services/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBJ6JsVfZ7GC0UiGr-7V45KgCpzDpntw4g",
  authDomain: "ai-time-b75ed.firebaseapp.com",
  projectId: "ai-time-b75ed",
  storageBucket: "ai-time-b75ed.firebasestorage.app",
  messagingSenderId: "76194681881",
  appId: "1:76194681881:web:0e696516f696c8b9c54688",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);


export { app, db, auth, storage };
