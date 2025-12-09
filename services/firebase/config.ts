import { initializeApp, getApps } from 'firebase/app';
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Your Firebase configuration from backend env.txt
const firebaseConfig = {
  apiKey: "AIzaSyCN7ySeUsVXChjGwL8uteMqSTe3ai395sI",
  authDomain: "internshipsystem-43e2c.firebaseapp.com",
  projectId: "internshipsystem-43e2c",
  storageBucket: "internshipsystem-43e2c.firebasestorage.app",
  messagingSenderId: "33734669598",
  appId: "1:33734669598:web:334184b82ceab5eba1850f",
  measurementId: "G-XZN75N2SZZ"
};

// Initialize Firebase (only once)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Auth with AsyncStorage persistence
const auth = (() => {
  try {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage)
    });
  } catch (error: any) {
    // If auth is already initialized, get the existing instance
    if (error?.code === 'auth/already-initialized') {
      return getAuth(app);
    }
    throw error;
  }
})();

export { auth };
export const storage = getStorage(app);

export default app;
