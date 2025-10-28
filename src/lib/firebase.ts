import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDmXRQ88_Xo7NgAEOYs-sbOUO73yIZe-Uo",
  authDomain: "studio-7186015998-fa4fe.firebaseapp.com",
  projectId: "studio-7186015998-fa4fe",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "your-storage-bucket",
  messagingSenderId: "905218028023",
  appId: "1:905218028023:web:2e2cece641cf95549efef2",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
