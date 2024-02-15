import { create } from 'zustand'
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get as fbGet, set as fbSet, child } from "firebase/database"
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth'


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

export const useUserStore = create((set, get) => ({
    uid: null,
    email: null,

    signInWithGoogle: () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                // const credential = GoogleAuthProvider.credentialFromResult(result);
                // const token = credential.accessToken;
                // const user = result.user;
                // console.log("result", result)
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
        signOut(auth).then(() => {
            console.log("signed out")
        }).catch((error) => {
            console.log("sign out error", error)
        })
    },
    initOnAuthStateChanged: () => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("User found", user)
                set({ uid: user.uid, email: user.email })
            } else {
                console.log("Init without user / User logged out")
                set({ uid: null, email: null })
            }
        });
    },
    saveData: (boardID, uniqueNodes) => {
        if (!get().uid || boardID === null || boardID === undefined || uniqueNodes.length === 0) {
            console.log("Trying to save data with null values: ", get().uid, boardID, uniqueNodes)
            return
        }
        fbSet(child(dbRef, `UserData/${get().uid}/BoardData/${boardID}`), {
            uniqueNodes
        }).catch((error) => {
            console.error(error);
        });
    },
    readData: async (boardID) => {
        if (!get().uid || boardID === null || boardID === undefined) {
            console.log("Trying to read data with null values: ", get().uid, boardID)
            return null
        }

        return await fbGet(child(dbRef, `UserData/${get().uid}/BoardData/${boardID}`)).then((snapshot) => {
            if (snapshot.exists()) {
                return snapshot.val()
            } else {
                console.log("No readData data available");
                return []
            }
        }).catch((error) => {
            console.error(error);
            return null
        });
    },
    readBoard: async () => {
        if (!get().uid) {
            console.log("Trying to read boards with null values: ", get().uid)
            return null
        }

        return await fbGet(child(dbRef, `UserData/${get().uid}/Boards`)).then((snapshot) => {
            if (snapshot.exists()) {
                return snapshot.val()
            } else {
                console.log("No readBoard data available");
                return []
            }
        }).catch((error) => {
            console.error(error);
            return null
        });
    },
    addBoard: async (title) => {
        await get().readBoard().then(async (res) => {
            if (!res) {
                return
            }

            var maxID = res.reduce((x, y) => {
                return x.id > y.id ? x : y
            }, { id: -1 }).id + 1

            res.push({
                id: maxID,
                title
            })

            await fbSet(child(dbRef, `UserData/${get().uid}/Boards`), [...res]).catch((error) => {
                console.error(error);
            });

            await get().saveData(maxID, [{
                "id": 0,
                "content": title,
                "childrenID": []
            }])
        })
    },
    deleteBoard: async (boardID) => {
        if (!get().uid || boardID === null || boardID === undefined) {
            console.log("Trying to delete board with null values: ", get().uid, boardID)
            return
        }

        await get().readBoard().then(async (res) => {
            if (!res) {
                return
            }

            res = res.filter(board => board.id !== boardID)

            await fbSet(child(dbRef, `UserData/${get().uid}/Boards`), [...res]).catch((error) => {
                console.error(error);
            });

            await fbSet(child(dbRef, `UserData/${get().uid}/BoardData/${boardID}`), null).catch((error) => {
                console.error(error);
            })
        })
    },
    getWhitelist: async () => {
        if (!get().uid) {
            console.log("Trying to read Whitelist with null values: ", get().uid)
            return null
        }

        return await fbGet(child(dbRef, `Whitelist`)).then((snapshot) => {
            if (snapshot.exists()) {
                return snapshot.val()
            } else {
                console.log("No Whitelist data available");
                return {}
            }
        }).catch((error) => {
            console.error(error);
            return null
        });
    },
    setWhitelist: async (list) => {
        if (!get().uid) {
            console.log("Trying to read Whitelist with null values: ", get().uid)
            return null
        }

        get().getWhitelist().then((res) => {
            Object.keys(res).forEach((key) => {
                if (list.indexOf(key) === -1) {
                    res[key].allowed = false
                } else {
                    res[key].allowed = true
                }
            });

            fbSet(child(dbRef, `Whitelist`), res).catch((error) => {
                console.error(error);
            })
        })
    },
}))