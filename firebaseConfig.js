// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth,initializeAuth,getReactNativePersistence } from "firebase/auth";
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Add this line

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const config = Constants.manifest?.extra || Constants.expoConfig?.extra;

const firebaseConfig = {
  apiKey: config?.firebaseApiKey,
  authDomain: config?.firebaseAuthDomain,
  databaseURL: config?.firebaseDatabaseUrl,
  projectId: config?.firebaseProjectId,
  storageBucket: config?.firebaseStorageBucket,
  messagingSenderId: config?.firebaseSenderId,
  appId: config?.firebaseAppId,
  measurementId: config?.firebaseMeasurementId
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// const auth = getAuth(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// export default app;
export default auth;