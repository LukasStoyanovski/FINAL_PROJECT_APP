// Import the functions you need from the modular Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDcYYecmjNVsSWtue5b_9q5NKPIKklnPHo",
  authDomain: "final-project-app-4081c.firebaseapp.com",
  projectId: "final-project-app-4081c",
  storageBucket: "final-project-app-4081c.appspot.com",
  messagingSenderId: "159231875",
  appId: "1:159231875:web:d53454780369f54b7750b6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
