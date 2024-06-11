import { useEffect, useState } from "react";
import { useBoardStoreProps } from "~/store/boardStore";
import { useEventActionStore } from "~/store/eventActionStore";
import { useFirebaseBoardStore } from "~/store/firebase/firebaseBoardStore";
import { useMainMapStore } from "~/store/mainMapStore";
import { useSelectorMapStore } from "~/store/selectorMapStore";
import { useUniqueNodeStore } from "~/store/uniqueNodeStore";
import { Node as reactflowNode } from 'reactflow'

// what should this listener do?
// listen on board data read from database (firebase)                                                                                                                    
// call read/save data for unique nodes
// call read/save data for main map spawned nodes

const NodeListener = () => {
    const action = useEventActionStore(state => state.action)
    const actionParam = useEventActionStore(state => state.actionParam)

    const readNodes = useFirebaseBoardStore(state => state.readNodes)
    const newTicket = useEventActionStore(state => state.newTicket)
    const eventActionReset = useEventActionStore(state => state.reset)

    const activeBoard = useBoardStoreProps(state => state.activeBoard)
    const mainMapReset = useMainMapStore(state => state.reset)
    const mainMapReadSaveData = useMainMapStore(state => state.readSaveData)
    const selectorMapReset = useSelectorMapStore(state => state.reset)
    const generateSelectorMap = useSelectorMapStore(state => state.generateSelectorMap)
    const uniqueNodeReadSaveData = useUniqueNodeStore(state => state.readSaveData)
    const uniqueNodeReset = useUniqueNodeStore(state => state.reset)

    const addUniqueNode = useUniqueNodeStore(state => state.addUniqueNode)
    const addChildToUniqueNode = useUniqueNodeStore(state => state.addChildToUniqueNode)

    const generateMainMap = useMainMapStore(state => state.generateMainMap)
    const addChildToSpawnedNode = useMainMapStore(state => state.addChildToSpawnedNode)

    const parentValue = useSelectorMapStore(state => state.parentValue)
    const childValue = useSelectorMapStore(state => state.childValue)
    const setParentValue = useSelectorMapStore(state => state.setParentValue)
    const setChildValue = useSelectorMapStore(state => state.setChildValue)

    const addEditHistoryData = useBoardStoreProps(state => state.addEditHistoryData)
    const revertAddEditHistoryData = useBoardStoreProps(state => state.revertAddEditHistoryData)
    const resetEditHistory = useBoardStoreProps(state => state.resetEditHistory)

    useEffect(() => {
        console.log("[Node] Listened active board update: ", activeBoard);
        readActiveBoard()
        resetEditHistory()
    }, [activeBoard])

    useEffect(() => {
        if (action !== null) {
            console.log("[Node] Listened action update: ", action);
            switch (action) {
                case 'add parent and child 2':
                    addParentAndChild()
                    eventActionReset(actionParam?.ticket)
                    break
                case 'read board':
                    addEditHistoryData()
                    readActiveBoard()
                    break
            }
        }
    }, [action])

    const readActiveBoard = () => {
        //TODO test non-resetEditHistory() flows (ie after resetNodes() and then undo/redo)

        if (activeBoard === null) {
            resetNodes()
        } else {
            //careful of handling action events with async logics
            const ticket = newTicket(null);
            if (ticket !== null) {
                console.log("[Node] Reading nodes from firebase of board: ", activeBoard);
                (async () => {
                    const res = await readNodes(activeBoard)
                    if (res === null) {
                        resetNodes()
                    } else {
                        // set unique nodes and spawned nodes & edges for main map 
                        uniqueNodeReadSaveData(res.uniqueNodeSaveData)
                        mainMapReadSaveData(res.mainMapSaveData)

                        selectorMapReset()
                        generateSelectorMap(useUniqueNodeStore.getState().uniqueNodes.map(un => un.content))
                    }

                    eventActionReset(ticket)
                })()
            }
        }
    }

    const resetNodes = () => {
        console.log("[Node] Reseting nodes")
        mainMapReset()
        selectorMapReset()
        uniqueNodeReset()
    }

    const addParentAndChild = () => {
        if (actionParam?.nodeArr === undefined || actionParam?.ticket === undefined) {
            console.error("actionParam or ticket is not set for addParentAndChild()", actionParam)
            return
        }

        addEditHistoryData()

        console.log(parentValue)
        console.log(childValue)

        var parentNode = null
        var childNode = null

        var isNewParent = false
        var isNewChild = false

        if (parentValue) {
            if (parentValue.id === -1) {
                parentNode = addUniqueNode(parentValue)
                setParentValue(parentNode) //set parent input box to show new node data
                isNewParent = true
            } else {
                parentNode = parentValue
            }
        }

        if (childValue) {
            if (childValue.id === -1) {
                childNode = addUniqueNode(childValue)
                isNewChild = true
            } else {
                childNode = childValue
            }
        }
        setChildValue(null) //reset child input box 

        if (parentNode !== null && childNode !== null) {
            if (addChildToUniqueNode(parentNode.id, childNode.id)) {
                addChildToSpawnedNode(parentNode.id, childNode.id, actionParam.nodeArr)
            } else {
                revertAddEditHistoryData()
            }
        }

        if (parentNode === null && childNode === null) {
            revertAddEditHistoryData()
        }

        if ((isNewParent && parentNode?.id === 0) || (isNewChild && childNode?.id === 0)) {
            generateMainMap()
        }
    }
    return (<></>);
};

export default NodeListener;



