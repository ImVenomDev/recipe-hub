import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAhjpy3UeevdtXS0A3Cm4FB5UJ1frmN2hc",
  authDomain: "recipe-hub1.firebaseapp.com",
  projectId: "recipe-hub1",
  storageBucket: "recipe-hub1.firebasestorage.app",
  messagingSenderId: "629355176396",
  appId: "1:629355176396:web:345c50c0047a26be863d69",
  measurementId: "G-JGZ80YPYB9"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); // Uncomment if you want to use analytics
const db = getFirestore(app);
const auth = getAuth(app);

//const analytics = getAnalytics(app);

const getData = async <T>(collectionName: string): Promise<T[]> => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
};


export { analytics, db, app, auth, getData };