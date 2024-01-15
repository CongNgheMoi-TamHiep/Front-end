import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    // apiKey: "AIzaSyA-cVkjTmgn6fK3rhK53tIktm7egz2GzV8",
    // authDomain: "zalo-78227.firebaseapp.com",
    // projectId: "zalo-78227",
    // storageBucket: "zalo-78227.appspot.com",
    // messagingSenderId: "759071450300",
    // appId: "1:759071450300:web:b5487d5e1bdac11922dcb9",
    // measurementId: "G-0NY743HJ9H"
    apiKey: "AIzaSyB4uGOZDJTjFMlSW7wo0iyAfe2fzpSMN9g",
    authDomain: "chat-app-b3d62.firebaseapp.com",
    projectId: "chat-app-b3d62",
    storageBucket: "chat-app-b3d62.appspot.com",
    messagingSenderId: "185949321240",
    appId: "1:185949321240:web:be6be0350e20b7d192ab6d",
    measurementId: "G-NS3SWSPT1D"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); 
export const storage = getStorage();