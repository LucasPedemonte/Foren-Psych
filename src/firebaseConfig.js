// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA0GzjRQJrGNH8I22MKV8EbnLLv9KHUoQY",
  authDomain: "forenpsych-d57fd.firebaseapp.com",
  projectId: "forenpsych-d57fd",
  storageBucket: "forenpsych-d57fd.appspot.com",
  messagingSenderId: "227038625085",
  appId: "1:227038625085:web:e284a0bcb6cfe988c95954",
  measurementId: "G-XK4QBEENX6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { auth };
