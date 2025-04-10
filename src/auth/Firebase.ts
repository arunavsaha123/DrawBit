import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAR2uW5Bz_NTfPlgQklq8-E49EBeihLzvU",
    authDomain: "drawbit-21d4f.firebaseapp.com",
    projectId: "drawbit-21d4f",
    storageBucket: "drawbit-21d4f.firebasestorage.app",
    messagingSenderId: "432816692576",
    appId: "1:432816692576:web:b89f9019ee837b53339205"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore(app);
export default app;