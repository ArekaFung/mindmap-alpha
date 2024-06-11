import { create } from 'zustand'
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth'

import { useFirebaseStore } from '~/store/firebase/firebaseStore'
import { useUserStore } from '~/store/userStore'
import { useEventActionStore } from '../eventActionStore'


interface FirebaseUserStoreProps {
    signInWithGoogle: () => void
    signOutWithGoogle: () => void
}

// set callback for auth state change
onAuthStateChanged(useFirebaseStore.getState().auth, (user) => {
    if (user) {
        console.log("User found", user, user.email)
        useUserStore.getState().setUserData({
            uid: user.uid,
            email: user.email
        })
        useEventActionStore.getState().setAction(null, 'load user data', null, 'Maintain')
    } else {
        console.log("Init without user / User logged out")
        useUserStore.getState().reset()
        useEventActionStore.getState().setAction(null, 'reset session', null, 'Maintain')
    }
});

export const useFirebaseUserStore = create<FirebaseUserStoreProps>((set, get) => ({
    signInWithGoogle: () => {
        signInWithPopup(useFirebaseStore.getState().auth, useFirebaseStore.getState().provider)
            .then((result) => {
                // const credential = GoogleAuthProvider.credentialFromResult(result);
                // const token = credential.accessToken;
                // const user = result.user;
                console.log("result", result)
                // console.log("credential", credential)
                // console.log("token", token)
                // console.log("user", user)
            }).catch((error) => {
                console.log("error", error)
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
            })
    },
    signOutWithGoogle: () => {
        signOut(useFirebaseStore.getState().auth).then(() => {
            console.log("signed out")
        }).catch((error) => {
            console.log("sign out error", error)
        })
    },
}))
