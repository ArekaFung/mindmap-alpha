import { useEffect, useState } from "react";
import { useBoardStoreProps } from "~/store/boardStore";
import { useEventActionStore } from '~/store/eventActionStore'
import { useFirebaseBoardStore } from "~/store/firebase/firebaseBoardStore";
import { useFirebaseUserStore } from "~/store/firebase/firebaseUserStore";
import { useMainMapStore } from "~/store/mainMapStore";
import { useSelectorMapStore } from "~/store/selectorMapStore";
import { useUniqueNodeStore } from "~/store/uniqueNodeStore";
import { useUserStore } from "~/store/userStore";


const ControlPanelListener = () => {
    const action = useEventActionStore(state => state.action)
    const setAction = useEventActionStore(state => state.setAction)
    const actionParam = useEventActionStore(state => state.actionParam)
    const newTicket = useEventActionStore(state => state.newTicket)
    const eventActionReset = useEventActionStore(state => state.reset)

    const signInWithGoogle = useFirebaseUserStore(state => state.signInWithGoogle)
    const signOutWithGoogle = useFirebaseUserStore(state => state.signOutWithGoogle)

    const activeBoard = useBoardStoreProps(state => state.activeBoard)
    const setActiveBoard = useBoardStoreProps(state => state.setActiveBoard)
    const setAvailableBoard = useBoardStoreProps(state => state.setAvailableBoard)
    const boardNodesToSaveData = useBoardStoreProps(state => state.toSaveData)
    const resetEditHistory = useBoardStoreProps(state => state.resetEditHistory)

    const readInfoList = useFirebaseBoardStore(state => state.readInfoList)
    const saveNodes = useFirebaseBoardStore(state => state.saveNodes)
    const addBoard = useFirebaseBoardStore(state => state.addBoard)
    const deleteBoard = useFirebaseBoardStore(state => state.deleteBoard)

    useEffect(() => {
        if (action !== null) {
            console.log("[Control Panel] Listened action update: ", action);
            switch (action) {
                case 'sign in with google':
                    signInWithGoogle()
                    eventActionReset()
                    break
                case 'sign out with google':
                    signOutWithGoogle()
                    eventActionReset()
                    break
                case 'set active board':
                    if (actionParam?.boardID === undefined) {
                        console.log("[Control Panel] Missing param for set active board: ", actionParam)
                        eventActionReset()
                    } else {
                        setActiveBoard(actionParam.boardID)
                        eventActionReset()
                    }
                    break
                case 'add board':
                    if (actionParam?.boardTitle === undefined) {
                        console.log("[Control Panel] Missing param for add board: ", actionParam)
                        eventActionReset()
                    } else {
                        const ticket = newTicket(null);
                        if (ticket !== null) {
                            console.log("[ControlPanel] Adding board to firebase");
                            (async () => {
                                var res1
                                if ((activeBoard !== null) || (activeBoard === null && boardNodesToSaveData().uniqueNodeSaveData.nodeArr.length === 0)) {
                                    res1 = await addBoard(actionParam.boardTitle!)
                                } else {
                                    res1 = await addBoard(actionParam.boardTitle!, boardNodesToSaveData())
                                }
                                if (res1 !== null) {
                                    console.log("[ControlPanel] Reading info list from firebase");
                                    (async () => {
                                        const res2 = await readInfoList()
                                        if (res2 !== null && res2.length > 0) {
                                            res2.sort(board => board.id)

                                            setActiveBoard(res1)
                                            setAvailableBoard(res2)
                                        }
                                    })()
                                }
                                eventActionReset(ticket)
                            })()
                        }
                    }
                    break
                case 'delete board':
                    if (activeBoard === null) {
                        console.log("[ControlPanel] Active board is null when trying to delete board");
                        eventActionReset()
                    } else {
                        if (window.confirm("Are you sure to delete?") == true) {
                            const ticket = newTicket(null);
                            if (ticket !== null) {
                                console.log("[ControlPanel] Deleting board to firebase");
                                (async () => {
                                    const res = await deleteBoard(activeBoard)
                                    //TODO show success message as toast
                                    if (res) {
                                        console.log("[ControlPanel] Deleted board to firebase");
                                        resetEditHistory() //TODO consider if reset at here is valid
                                    } else if (res === false) {
                                        console.log("[ControlPanel] NOT Deleted board to firebase");
                                        resetEditHistory() //TODO consider if reset at here is valid
                                    } else { // res === null

                                    }

                                    setAction(ticket, 'load user data', null, 'Reset')
                                })()
                            }
                        } else {
                            eventActionReset()
                        }
                    }
                    break
                case 'save board':
                    if (activeBoard === null) {
                        console.log("[ControlPanel] Active board is null when trying to save board");
                        eventActionReset()
                    } else {
                        const ticket = newTicket(null);
                        if (ticket !== null) {
                            console.log("[ControlPanel] Saving board to firebase");
                            (async () => {
                                const res = await saveNodes(activeBoard, boardNodesToSaveData())
                                //TODO show success message as toast
                                if (res) {
                                    console.log("[ControlPanel] Saved board to firebase");
                                } else {
                                    console.log("[ControlPanel] NOT saved board to firebase");
                                }
                                eventActionReset(ticket)
                            })()
                        }
                    }
                    break
            }
        }
    }, [action])


    return (<></>);
};

export default ControlPanelListener;



