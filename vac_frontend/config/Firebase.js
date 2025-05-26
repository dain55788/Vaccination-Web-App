import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from 'expo-constants';
const { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appID } = Constants.expoConfig.extra

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appID,
  databaseURL: 'https://console.firebase.google.com/u/0/project/vaccination-realtime-chatting/firestore/databases/-default-/data',
};

console.info('Firebase config configuring...')
let app = initializeApp(firebaseConfig);
console.info('Firebase app initialized!');

console.info('Initializing Authentication...'); 
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});
console.info('Authentication initialized:', auth);

console.info('Initializing Firestore...');
export const database = getFirestore(app);
console.info('Firestore initialized');
