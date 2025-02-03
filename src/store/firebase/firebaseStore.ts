import { create } from 'zustand'
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getDatabase, ref, DatabaseReference, get as fbGet, child } from "firebase/database"
import { getAuth, GoogleAuthProvider, Auth, setPersistence, inMemoryPersistence } from 'firebase/auth'

console.log('firebase store file')

const firebaseConfig = {
    apiKey: "AIzaSyC_NScqAxVjhciLIe6OHE0wGgbLFOz1rMk",
    authDomain: "mindmap-d3e97.firebaseapp.com",
    projectId: "mindmap-d3e97",
    storageBucket: "mindmap-d3e97.appspot.com",
    messagingSenderId: "360569865682",
    appId: "1:360569865682:web:6d31dbf24e2695ea26740b",
    databaseURL: "https://mindmap-d3e97-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

const app = initializeApp(firebaseConfig);
const dbRef = ref(getDatabase(app))
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
    prompt: 'select_account'
});

interface FirebaseStoreProps {
    app: FirebaseApp,
    dbRef: DatabaseReference,
    auth: Auth,
    provider: GoogleAuthProvider,
}

export const useFirebaseStore = create<FirebaseStoreProps>((set, get) => ({
    app: app,
    dbRef: dbRef,
    auth: auth,
    provider: provider,
}))