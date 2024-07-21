// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Required for side-effects
import {getFirestore} from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBOjqdUEIgnqf_D1IFk8XsiDDdta9rl9Rg",
  authDomain: "hodl-baef6.firebaseapp.com",
  projectId: "hodl-baef6",
  storageBucket: "hodl-baef6.appspot.com",
  messagingSenderId: "258620978179",
  appId: "1:258620978179:web:a3b69ee0eb05d814350a36"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)