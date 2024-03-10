import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBIs7bl7LaVq6YCh4S5s31dUOefuKDaGrk",
  authDomain: "mern-blogging-site-6ed02.firebaseapp.com",
  projectId: "mern-blogging-site-6ed02",
  storageBucket: "mern-blogging-site-6ed02.appspot.com",
  messagingSenderId: "770309190161",
  appId: "1:770309190161:web:b92b7ff65bbdcdca4f77b0",
  measurementId: "G-S1GS9N1PY0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Googole Auth
const provider = new GoogleAuthProvider();
const auth = getAuth();

export const authWithGoogle = async () => {
  let user = null;
  await signInWithPopup(auth, provider)
    .then((result) => {
      /** @type {firebase.User} */
      user = result.user;
    })
    .catch((error) => {
      console.log("Error signing in with Google");
      console.log(error);
    });
  return user;
};
