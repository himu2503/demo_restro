import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth   } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyCDuWUX6FoNrTOdFLLC9O9Tf2tR9wMQ5kI",
  authDomain: "lunchbox-demo-898c1.firebaseapp.com",
  projectId: "lunchbox-demo-898c1",
  storageBucket: "lunchbox-demo-898c1.firebasestorage.app",
  messagingSenderId: "1077850086821",
  appId: "1:1077850086821:web:db3fb4429335e2f94e1c4c",
  measurementId: "G-R9MQ189072"
};

const app = initializeApp(firebaseConfig);
getAnalytics(app);
export const auth = getAuth(app);