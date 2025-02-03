import { create } from 'zustand'
import { IReactFlowNodeProps } from '~/model/reactFlowProps'
import { nodePadding, spawnNodes, adjustNodesByPadding, getMaxChildHeightRelative } from '~/util/mapStoreUtil'
import { BaseMapStoreProps, SaveableStoreProps } from '~/store/baseStoreProps'
import { applyNodeChanges, NodeChange, Node } from 'reactflow'
import { useUniqueNodeStore } from '~/store/uniqueNodeStore'
import { customEdgePropsTypes } from '~/model/customEdgePropsTypes'
import saveParser from '~/util/saveParserUtil'
import { MainMapSaveData } from '~/model/saveDataProps'

interface MainMapStoreProps extends BaseMapStoreProps, SaveableStoreProps<MainMapSaveData> {
    generateMainMap: () => void,
    addChildToSpawnedNode: (parentID: number, childID: number, flowNodes: Node[]) => void,
    pruneChildFromSpawnedNode: (targetParentID: number, targetChildID: number, flowNodes: Node[]) => void,
}


export const useMainMapStore = create<MainMapStoreProps>((set, get) => ({
    reset: () => {
        set({
            spawnedNodes: [],
            spawnedEdges: [],
        })
    },
    toSaveDataString: () => {
        return saveParser.mainMap.createSaveDataString(get().toSaveData())
    },
    readSaveDataString: (saveData: string) => {
        const res = saveParser.mainMap.readSaveDataString(saveData)
        get().readSaveData(res)
    },
    toSaveData: () => {
        return ({
            nodeArr: get().spawnedNodes.map(sn => {
                if (sn.parentNode === undefined) {
                    return {
                        id: sn.id,
                        position: { x: sn.position.x, y: sn.position.y },
                        type: sn.type,
                        data: sn.data,
                    }
                } else {
                    return {
                        id: sn.id,
                        position: { x: sn.position.x, y: sn.position.y },
                        type: sn.type,
                        parentNode: sn.parentNode,
                        data: sn.data,
                    }
                }
            }),
            edgeArr: get().spawnedEdges.map(se => {
                return {
                    id: se.id,
                    source: se.source,
                    target: se.target,
                    sourceHandle: se.sourceHandle,
                    targetHandle: se.targetHandle,
                    type: se.type,
                    animated: se.animated,
                    markerEnd: se.markerEnd,
                    style: se.style
                }
            })
        })
    },
    readSaveData: (saveData: MainMapSaveData) => {
        saveParser.mainMap.readSaveData(saveData);
        //to re-link the reference in data with the actual uniqueNode
        saveData.nodeArr.forEach((sn) => {
            const targetNode = useUniqueNodeStore.getState().getFromUniqueNodes(sn.data.uniqueNode.id)
            if (targetNode === null || targetNode === undefined) {
                console.log("UniqueNode not linked for: ", sn)
                return
            } else {
                sn.data.uniqueNode = targetNode
            }
        })

        set({
            spawnedNodes: saveData.nodeArr,
            spawnedEdges: saveData.edgeArr,
        })
    },

    spawnedNodes: [],
    spawnedEdges: [],

    setSpawnedNodes: (spawnedNodes) => set({ spawnedNodes }),
    setSpawnedEdges: (spawnedEdges) => set({ spawnedEdges }),

    onNodesChange: (changes: NodeChange[]) => {
        // console.log("onChanges", changes)
        set({ spawnedNodes: (applyNodeChanges(changes, get().spawnedNodes) as unknown as IReactFlowNodeProps[]) })
    },

    generateMainMap: () => {
        if (!useUniqueNodeStore.getState().getFromUniqueNodes(0)) {
            console.log("No Root found when generate flow map")
            return
        }

        const spawnRes = spawnNodes(0, { x: 0, y: 0 }, 'colorNode', { x: -1, y: 0 }, 0, false, undefined)
        if (spawnRes !== null) {
            get().setSpawnedNodes(spawnRes.nodeArr)
            get().setSpawnedEdges(spawnRes.edgeArr)
        }
    },

    addChildToSpawnedNode: (parentID: number, childID: number, flowNodes: Node[]) => {
        //NOTE: cannot handle real custom positions for "partial" overlap
        get().spawnedNodes.filter(sn => sn.data.uniqueNode.id === parentID).forEach(sn => {
            console.log(sn)
            const maxChildHeightRelative = getMaxChildHeightRelative(sn, get().spawnedNodes)
            const firstBornPadding = sn.data.childrenID.length > 0 ? nodePadding.y : 0

            const parentFlowNodeHeightAbsolute = flowNodes.find(fn => fn.id === sn.id)?.positionAbsolute?.y
            const spawnRes = spawnNodes(childID, { x: 0, y: maxChildHeightRelative + firstBornPadding }, 'colorNode', { x: sn.data.treePos.x + 1, y: 0 }, getLargestSpawnedNodeID(get().spawnedNodes), false, sn.id)

            if (parentFlowNodeHeightAbsolute !== undefined && spawnRes !== null) {
                const targetHeightAbsolute = maxChildHeightRelative + parentFlowNodeHeightAbsolute
                const padding = getMaxChildHeightRelative(spawnRes.self, spawnRes.nodeArr)
                adjustNodesByPadding(targetHeightAbsolute, padding + firstBornPadding, flowNodes)

                set({
                    spawnedNodes: [...get().spawnedNodes, ...spawnRes.nodeArr],
                    spawnedEdges: [...get().spawnedEdges, ...spawnRes.edgeArr, {
                        id: sn.id + ' - ' + spawnRes.self.id,
                        source: sn.id,
                        target: spawnRes.self.id,
                        ...customEdgePropsTypes.defaultEdgeProps
                    }]
                })
                sn.data.childrenID.push(spawnRes.self.id)

                console.log(getMaxChildHeightRelative(spawnRes.self, get().spawnedNodes))
            } else {
                //TODO add log/handling here
            }
        })
    },
    pruneChildFromSpawnedNode: (targetParentID: number, targetChildID: number, flowNodes: Node[]) => {
        //NOTE: cannot handle real custom positions for "partial" overlap
        //NOTE: detecting if have siblings works for determining move how much 
        const pruneListChildID: string[] = []
        const pruneListFullID: string[] = []
        var firstBornPadding = 0


        get().spawnedNodes.filter(sn => sn.data.uniqueNode.id === targetParentID).forEach(sn => {
            const targetSpawnedNodeID = sn.data.childrenID.filter(csn => get().spawnedNodes.find(sn2 => sn2.id === csn && sn2.data.uniqueNode.id === targetChildID))
            if (targetSpawnedNodeID !== undefined) {
                targetSpawnedNodeID.forEach(tsnID => {
                    pruneListChildID.push(tsnID)
                    sn.data.childrenID = sn.data.childrenID.filter(c => c !== tsnID)
                })
            }

            if (sn.data.childrenID.length > 0) {
                firstBornPadding = nodePadding.y
            }
        })

        if (pruneListChildID.length > 0) {
            const sampleNode = get().spawnedNodes.find(sn => sn.id === pruneListChildID[0])
            if (sampleNode !== undefined) {
                const padding = getMaxChildHeightRelative(sampleNode, get().spawnedNodes)

                pruneListChildID.forEach(plID => {
                    recurAddPruneList(plID)
                    const targetFlowNode = flowNodes.find(fn => fn.id === plID)
                    if (targetFlowNode !== undefined && targetFlowNode.positionAbsolute?.y !== undefined) {
                        // const remainChildCount = get().spawnedNodes.find(sn => sn.data.childrenID.includes(plID))?.data.childrenID.filter(c => c !== plID).length
                        // const firstBornPadding = (remainChildCount !== undefined && remainChildCount > 0) ? nodePadding.y : 0

                        adjustNodesByPadding(targetFlowNode.positionAbsolute.y + padding, -(padding + firstBornPadding), flowNodes)
                    }
                })

                set({
                    spawnedNodes: [...get().spawnedNodes.filter(sn => !pruneListFullID.includes(sn.id))],
                    spawnedEdges: [...get().spawnedEdges.filter(se => !(pruneListFullID.includes(se.source) || pruneListFullID.includes(se.target)))]
                })
            }
        }

        function recurAddPruneList(plID: string) {
            const targetNode = get().spawnedNodes.find(sn => sn.id === plID)

            if (targetNode !== undefined) {
                pruneListFullID.push(plID)
                targetNode.data.childrenID.forEach(c => {
                    recurAddPruneList(c)
                })
            }
        }
    },

}))

const getLargestSpawnedNodeID = (nodes: { id: string }[]) => {
    return Number(
        nodes.reduce((x, y) => {
            return Number(x.id) > Number(y.id) ? x : y
        }, { id: "-1" }).id
    ) + 1
}