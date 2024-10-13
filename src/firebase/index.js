// Import modul Firebase dengan cara modular
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 
import { getStorage } from "firebase/storage"; 

// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBCc5ioP4l80rNZ3AAeIPSEBAQqaSE4UOs",
  authDomain: "hbds-2ca8d.firebaseapp.com",
  projectId: "hbds-2ca8d",
  storageBucket: "hbds-2ca8d.appspot.com",
  messagingSenderId: "1036617409560",
  appId: "1:1036617409560:web:48e0075a1a83783d4b8f6d",
  measurementId: "G-E9C2CTPE38"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Mendapatkan instance Firestore dan Firebase Storage
const firestore = getFirestore(app);
const storage = getStorage(app);

export { firestore, storage };
