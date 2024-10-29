// Import the Firebase and Firestore modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAmWBQPzAWK9Pfi3rXTr3RDliCj3rE5dPg",
    authDomain: "srilaxmi-ricemill.firebaseapp.com",
    projectId: "srilaxmi-ricemill",
    storageBucket: "srilaxmi-ricemill.appspot.com",
    messagingSenderId: "128637974155",
    appId: "1:128637974155:web:4b419c882758816308468e",
    measurementId: "G-6YNRGBEB37"
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Export database to use in other scripts
export { db };
