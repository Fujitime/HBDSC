// Import modul Firebase dengan cara modular
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 
import { getStorage } from "firebase/storage"; 

// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBDlDZCQOR4DBejHFwJSq-BCIYjxl1Qv1A",
  authDomain: "vue-blog-1b72c.firebaseapp.com",
  projectId: "vue-blog-1b72c",
  storageBucket: "vue-blog-1b72c.appspot.com",
  messagingSenderId: "902033285642",
  appId: "1:902033285642:web:89208a21a8f7e87b05f5f3"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Mendapatkan instance Firestore dan Firebase Storage
const firestore = getFirestore(app);
const storage = getStorage(app);

export { firestore, storage };
