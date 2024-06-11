import { useEffect, useState } from "react";
import { useBoardStoreProps } from "~/store/boardStore";
import { useEventActionStore } from '~/store/eventActionStore'
import { useFirebaseBoardStore } from "~/store/firebase/firebaseBoardStore";
import { useFirebaseUserStore } from "~/store/firebase/firebaseUserStore";
import { useMainMapStore } from "~/store/mainMapStore";
import { useSelectorMapStore } from "~/store/selectorMapStore";
import { useUniqueNodeStore } from "~/store/uniqueNodeStore";
import { useUserStore } from "~/store/userStore";

// what should this listener do?
// listen on actions triggered by event: user login => reload data                                                                                                                
// listen on actions triggered by event: user logout => reset data                                                                                                                

const MapAppListener = () => {
    const action = useEventActionStore(state => state.action)
    const newTicket = useEventActionStore(state => state.newTicket)
    const eventActionReset = useEventActionStore(state => state.reset)

    const activeBoard = useBoardStoreProps(state => state.activeBoard)
    const setActiveBoard = useBoardStoreProps(state => state.setActiveBoard)
    const setAvailableBoard = useBoardStoreProps(state => state.setAvailableBoard)
    const boardNodesToSaveData = useBoardStoreProps(state => state.toSaveData)
    const boardReset = useBoardStoreProps(state => state.reset)
    const undoEditData = useBoardStoreProps(state => state.undoEditData)
    const redoEditData = useBoardStoreProps(state => state.redoEditData)


    const readInfoList = useFirebaseBoardStore(state => state.readInfoList)

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            // Perform actions before the component unloads\
            // console.log("Active board: ", activeBoard)
            // console.log("Active board: ", useBoardStoreProps.getState().activeBoard)
            // console.log("Node length: ", boardNodesToSaveData().uniqueNodeSaveData.nodeArr.length)
            if (useBoardStoreProps.getState().activeBoard === null && boardNodesToSaveData().uniqueNodeSaveData.nodeArr.length !== 0) { //somehow necessary to use store.getState() instead of just subscribing like normally do 
                event.preventDefault();
            }
        }
        const handleCtrlZ = (event: KeyboardEvent) => {
            if ((event.key === 'z' || event.key === 'Z') && (event.ctrlKey || event.metaKey)) {
                event.stopImmediatePropagation(); // prevent other event listener to be triggered
                event.preventDefault();
                if (event.shiftKey) {
                    // handle redo action
                    redoEditData()
                } else {
                    // handle undo action
                    undoEditData()
                }
            }
        }



        window.addEventListener('beforeunload', handleBeforeUnload)
        window.addEventListener('keydown', handleCtrlZ)
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload)
            window.removeEventListener('keydown', handleCtrlZ)
        };
    }, [])

    useEffect(() => {
        if (action !== null) {
            console.log("[MapApp] Listened action update: ", action);
            switch (action) {
                case 'load user data':
                    //careful of handling action events with async logics
                    const ticket = newTicket(null);
                    if (ticket !== null) {
                        console.log("[MapApp] Reading info list from firebase");
                        (async () => {
                            const res = await readInfoList()
                            if (res !== null && res.length > 0) {
                                res.sort(board => board.id)

                                // TODO handle scenario of maintaining the state before sign in (instead of completely discard)
                                // TODO handle local boards?
                                if (activeBoard !== null || boardNodesToSaveData().uniqueNodeSaveData.nodeArr.length === 0) {
                                    setActiveBoard(res[0].id)
                                }
                                // setAvailableBoard([...availableBoard, ...res])
                                setAvailableBoard(res)
                            } else {
                                boardReset()
                            }
                            eventActionReset(ticket)
                        })()
                    }
                    break
                case 'reset session':
                    // if user info is reset as well (eg triggered by logout): this function simply as a clear state logic
                    // if user info is not reset: this can function as wipe user stored map data

                    //reset board would trigger reset of main map, selector map, unique nodes
                    boardReset()
                    // mainMapReset()
                    // selectorMapReset()
                    // uniqueNodesReset()

                    eventActionReset()
                    break
            }
        }
    }, [action])


    return (<></>);
};

export default MapAppListener;



