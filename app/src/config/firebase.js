import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyD4xJicmLoxmGIdZMRQLFQChxmUkQPfYEI",
  authDomain: "myappnhksd.firebaseapp.com",
  projectId: "myappnhksd",
  storageBucket: "myappnhksd.appspot.com",
  messagingSenderId: "279403178619",
  appId: "1:279403178619:web:3eab11636b78f893b010de",
  measurementId: "G-K1LPCB0SH1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app); 