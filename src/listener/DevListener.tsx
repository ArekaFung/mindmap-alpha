import { useEffect, useState } from "react";
import { useUniqueNodeStore } from '~/store/uniqueNodeStore'
import { useMainMapStore } from '~/store/mainMapStore'
import { useSelectorMapStore } from '~/store/selectorMapStore'
import { useEventActionStore } from '~/store/eventActionStore'
import { IReactFlowNodeProps, ColorNodeProps, ReactFlowEdgeProps } from '~/model/reactFlowProps'
import { customEdgePropsTypes } from '~/model/customEdgePropsTypes'
import { SpawnRes } from '~/model/commonProps'
import data from './data'
import { spawnNodes } from "~/util/mapStoreUtil";
import { useFirebaseBoardStore } from '~/store/firebase/firebaseBoardStore'
import { useFirebaseUserStore } from "~/store/firebase/firebaseUserStore";
import { useBoardStoreProps } from "~/store/boardStore";
import { useFirebaseStore } from "~/store/firebase/firebaseStore";
import { getDatabase, ref, get as dbGet, set as dbSet, child, DatabaseReference, Database } from 'firebase/database'

const DevListener = () => {
    const [fl, sfl] = useState(true)
    const action = useEventActionStore(state => state.action)
    const ticket = useEventActionStore(state => state.ticket)
    const setAction = useEventActionStore(state => state.setAction)

    const dbRef = useFirebaseStore(state => state.dbRef)

    const addBoard = useFirebaseBoardStore(state => state.addBoard)
    const readNodes = useFirebaseBoardStore(state => state.readNodes)
    const saveNodes = useFirebaseBoardStore(state => state.saveNodes)
    const deleteBoard = useFirebaseBoardStore(state => state.deleteBoard)

    const signInWithGoogle = useFirebaseUserStore(state => state.signInWithGoogle)
    const signOutWithGoogle = useFirebaseUserStore(state => state.signOutWithGoogle)

    const initUniqueNodes = useUniqueNodeStore(state => state.initUniqueNodes)
    const uniqueNodes = useUniqueNodeStore(state => state.uniqueNodes)
    const unread = useUniqueNodeStore(state => state.readSaveData)
    const untsd = useUniqueNodeStore(state => state.toSaveData)

    const generateMainMap = useMainMapStore(state => state.generateMainMap)
    const toSaveData = useMainMapStore(state => state.toSaveData)
    const readSaveData = useMainMapStore(state => state.readSaveData)
    const spawnedNodes = useMainMapStore(state => state.spawnedNodes)

    const activeBoard = useBoardStoreProps(state => state.activeBoard)
    const setActiveBoard = useBoardStoreProps(state => state.setActiveBoard)
    const boardNodesToSaveData = useBoardStoreProps(state => state.toSaveData)
    const addEditHistoryData = useBoardStoreProps(state => state.addEditHistoryData)
    const revertAddEditHistoryData = useBoardStoreProps(state => state.revertAddEditHistoryData)
    const undoEditData = useBoardStoreProps(state => state.undoEditData)
    const redoEditData = useBoardStoreProps(state => state.redoEditData)

    const selectorMapReset = useSelectorMapStore(state => state.reset)


    useEffect(() => {
        if (fl) {
            sfl(false)
            console.log("Dev listener first load")
            // initUniqueNodes(data.uniqueNodes)
            // generateMainMap()
        }
    }, [fl])

    useEffect(() => {
        if (action !== null) {
            console.log("action in dev", action)
            // switch (action) {
            //     case 'load user data':
            //         setAction('add parent and child')
            //         break
            // }
            // setAction(null)
        }
    }, [action])


    return <>
        <button onClick={async () => {
            console.log(dbRef);
            console.log(getDatabase());

        }}>button 1</button >

        <button onClick={async () => {
            console.log("Active board: ", activeBoard)
            console.log("Node length: ", boardNodesToSaveData().uniqueNodeSaveData.nodeArr.length)
        }}>button 2</button>

        <button onClick={async () => {
            console.log("Board data", boardNodesToSaveData())
            console.log("Action", action)
            console.log("Ticket", ticket)
        }}>button 3</button>



        <button onClick={() => {
            signInWithGoogle()
            console.log("After function")
        }}>signin</button>
        <button onClick={() => {
            signOutWithGoogle()
        }}>sign out</button>


    </>;
};

export default DevListener;

