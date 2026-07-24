import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD1XeUE6bhoXmyiD6MhVYxo63NstD27xJA",
  authDomain: "veyrox-systems.firebaseapp.com",
  projectId: "veyrox-systems",
  storageBucket: "veyrox-systems.firebasestorage.app",
  messagingSenderId: "539096217297",
  appId: "1:539096217297:web:2d538c4176d460e9ff37f0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };