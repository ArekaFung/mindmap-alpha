import { useUserStore } from './Store/UserStore.js'
import { useNodesStore } from './Store/NodesStore.js'
import React, { useCallback, useEffect } from 'react';
import TextField from '@mui/material/TextField';

const InitFirebase = () => {
    const [firstLoad, sfl] = React.useState(true)
    const [boardTitle, setBoardTitle] = React.useState("")

    const uid = useUserStore(state => state.uid)
    const readData = useUserStore(state => state.readData)
    const saveData = useUserStore(state => state.saveData)
    const signInWithGoogle = useUserStore(state => state.signInWithGoogle)
    const signOutWithGoogle = useUserStore(state => state.signOutWithGoogle)
    const initOnAuthStateChanged = useUserStore(state => state.initOnAuthStateChanged)
    const readBoard = useUserStore(state => state.readBoard)

    const resetNodeStore = useNodesStore(state => state.resetNodeStore)
    const setActiveBoard = useNodesStore(state => state.setActiveBoard)
    const setAvailableBoard = useNodesStore(state => state.setAvailableBoard)
    const addBoard = useUserStore(state => state.addBoard)


    useEffect(() => {
        if (firstLoad) {
            sfl(false)
            initOnAuthStateChanged()
        }
    }, [firstLoad])

    useEffect(() => {
        console.log("uid changed")
        if (uid) {
            readBoardFromFirebase()
        }else{
            console.log("empty uid")
            resetNodeStore()
        }
    }, [uid])

    function readBoardFromFirebase(){
        readBoard().then(res => {
            if(res && res.length > 0){
                console.log("set board", res)
                setAvailableBoard(res)
                setActiveBoard(res[0].id)
            }else{
                console.log("empty boards")
                resetNodeStore()
            }
        })
    }
    
    return (
        <>
            {/* <button onClick={() => console.log(auth.currentUser)}> 1butt </button>
            <button onClick={() => console.log(uid)}> 2butt </button>
            <button onClick={() => console.log(userValue)}> 3butt </button>
            <TextField
                id="outlined-controlled"
                label="New Board"
                value={boardTitle}
                onChange={(event) => {
                    setBoardTitle(event.target.value);
                }}
            />

            <button onClick={() => {
                readData(1).then(x => console.log(x))
            }}> 1butt </button>
            <button onClick={async () => {
                await addBoard(boardTitle)
                readBoardFromFirebase()  
            }}> add board </button>
            

            <button onClick={signInWithGoogle}> sign in </button>
            <button onClick={signOutWithGoogle}> sign out </button> */}
        </>
    )

}

export default InitFirebase