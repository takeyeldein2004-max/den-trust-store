import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyCsIVBJwLJbXid-zMnAGJKiGUnyclRdx2E",
  authDomain: "dentrust-store.firebaseapp.com",
  projectId: "dentrust-store",
  storageBucket: "dentrust-store.firebasestorage.app",
  messagingSenderId: "329446851630",
  appId: "1:329446851630:web:b0a5c288411b86b295cbbf",
  measurementId: "G-334J63L1NX"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)