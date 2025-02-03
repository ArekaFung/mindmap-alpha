import { useEffect, useState } from "react";
import { useUniqueNodeStore } from '~/store/uniqueNodeStore'
import { useMainMapStore } from '~/store/mainMapStore'
import { useSelectorMapStore } from '~/store/selectorMapStore'
import { useEventActionStore } from '~/store/eventActionStore'
import { useReactFlow } from "reactflow";
import { useBoardStoreProps } from "~/store/boardStore";


const MainMapListener = () => {
    const reactFlow = useReactFlow();
    const action = useEventActionStore(state => state.action)
    const actionParam = useEventActionStore(state => state.actionParam)
    const setAction = useEventActionStore(state => state.setAction)
    const newTicket = useEventActionStore(state => state.newTicket)
    const eventActionReset = useEventActionStore(state => state.reset)

    const pruneChildFromUniqueNode = useUniqueNodeStore(state => state.pruneChildFromUniqueNode)

    const generateMainMap = useMainMapStore(state => state.generateMainMap)

    const selectorMapSpawnedNodes = useSelectorMapStore(state => state.spawnedNodes)
    const selectorMapReset = useSelectorMapStore(state => state.reset)
    const generateSelectorMap = useSelectorMapStore(state => state.generateSelectorMap)

    const pruneChildFromMainMapSpawnedNode = useMainMapStore(state => state.pruneChildFromSpawnedNode)

    const addEditHistoryData = useBoardStoreProps(state => state.addEditHistoryData)

    useEffect(() => {
        if (action !== null) {
            console.log("[Mainmap] Listened action update: ", action);
            switch (action) {
                case 'regen main map':
                    addEditHistoryData()
                    generateMainMap()
                    eventActionReset()
                    break
                case 'add parent and child 1':
                    const ticket = newTicket(null);
                    if (ticket !== null) {
                        console.log("[Mainmap] add parent and child 1");
                        setAction(ticket, 'add parent and child 2', { nodeArr: reactFlow.getNodes(), ticket: ticket }, 'Maintain')
                    }
                    break
                case 'prune child':
                    if (actionParam?.pruneParentSpawnedNodeID === undefined || actionParam?.pruneChildSpawnedNodeID === undefined) {
                        console.log("[Mainmap] Missing param for prune child: ", actionParam)
                        eventActionReset()
                    } else {
                        const pruneParentID = selectorMapSpawnedNodes.find(x => x.id === actionParam.pruneParentSpawnedNodeID)?.data.uniqueNode.id
                        const pruneChildID = selectorMapSpawnedNodes.find(x => x.id === actionParam.pruneChildSpawnedNodeID)?.data.uniqueNode.id

                        if (pruneParentID === undefined || pruneChildID === undefined) {
                            console.log("[Mainmap] Undefined ID for prune parent/child: ", pruneParentID, pruneChildID)
                        } else {
                            addEditHistoryData()
                            pruneChildFromMainMapSpawnedNode(pruneParentID, pruneChildID, reactFlow.getNodes())
                            pruneChildFromUniqueNode(pruneParentID, pruneChildID)
                            selectorMapReset()
                            generateSelectorMap([''])
                        }

                        eventActionReset()
                    }
                    break
            }
        }
    }, [action])


    return (<></>);
};

export default MainMapListener;