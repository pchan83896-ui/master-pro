import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// ค่าทั้งหมดอ่านจากไฟล์ .env (ดู .env.example) — ตัวแปรต้องขึ้นต้นด้วย VITE_
const env = import.meta.env;

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

// ชื่อโฟลเดอร์ข้อมูลใน Firestore: artifacts/{appId}/public/data/...
export const appId = env.VITE_APP_ID || 'manhwa-platform-v1';

let auth = null;
let db = null;

if (isFirebaseConfigured) {
  try {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (e) {
    console.warn('Firebase initialization warning:', e);
  }
}

export { auth, db };
