// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// import Constants from "expo-constants";
// import { getReactNativePersistence, initializeAuth } from "firebase/auth";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const firebaseConfig = {
//   apiKey: Constants.expoConfig.extra.apiKey,
//   authDomain: Constants.expoConfig.extra.authDomain,
//   projectId: Constants.expoConfig.extra.projectId,
//   storageBucket: Constants.expoConfig.extra.storageBucket,
//   messagingSenderId: Constants.expoConfig.extra.messagingSenderId,
//   appId: Constants.expoConfig.extra.appId,
//   databaseURL: Constants.expoConfig.extra.databaseURL,
// };

// // const app = initializeApp(firebaseConfig);
// // export const auth = getAuth(app);
// // export const database = getFirestore(app);

// console.log('Firebase Config, nice');
// const app = initializeApp(firebaseConfig);
// console.log('Firebase App Initialized, nice');
// export const auth = initializeAuth(app, {
//     persistence: getReactNativePersistence(AsyncStorage),
// });
// console.log('Auth Initialized');
// export const db = getFirestore(app);

// export default app;