import { create } from 'zustand'
import { logicAddChild } from '../Features/UniqueNodeLogic'
import { spawnNodes } from '../Features/SpawnedNodeLogic.js'
import { Node } from '../Features/NodeData.js'

export const useNodesStore = create((set, get) => ({
    uniqueNodes: [],
    spawnedNodes: [],
    spawnedEdges: [],
    selectorSpawnedNodes: [],
    selectorSpawnedEdges: [],
    activeBoard: null,
    availableBoard: [],
    resetNodeStore: () => {
        set({
            uniqueNodes: [],
            spawnedNodes: [],
            spawnedEdges: [],
            selectorSpawnedNodes: [],
            selectorSpawnedEdges: [],
            activeBoard: null,
            availableBoard: [],
        })
    },

    setActiveBoard: (activeBoard) => set({ activeBoard }),
    setAvailableBoard: (availableBoard) => set({ availableBoard }),
    addUniqueNode: (nodeProp) => {
        if (nodeProp.id === null || nodeProp.id === undefined || nodeProp.id < 0) {
            nodeProp.id = get().getLargestNodeID(get().uniqueNodes)
        }

        if (nodeProp.childrenID === null || nodeProp.childrenID === undefined) {
            nodeProp.childrenID = []
        }

        var res = new Node(nodeProp)
        get().uniqueNodes.push(res)
        return res
    },

    addChildToUniqueNode: (parentID, childID) => {
        return logicAddChild(get().getFromUniqueNodes, parentID, childID)
    },

    setSpawnedNodes: (spawnedNodes) => {
        spawnedNodes = spawnedNodes.map(sn => sn.toFlowNode())
        set({ spawnedNodes })
    },
    setSpawnedEdges: (spawnedEdges) => {
        set({ spawnedEdges })
    },

    setSelectorSpawnedNodes: (selectorSpawnedNodes) => {
        selectorSpawnedNodes = selectorSpawnedNodes.map(ssn => ssn.toFlowNode())
        set({ selectorSpawnedNodes })
    },
    setSelectorSpawnedEdges: (selectorSpawnedEdges) => {
        set({ selectorSpawnedEdges })
    },

    removeAllSpawnedNodes: () => set({ spawnedNodes: [] }),

    getFromUniqueNodes: (targetID) => {
        if (targetID === null || targetID === undefined) {
            console.log("Null target to get from uniqueNodes");
            return null
        }

        //note: will return undefined if cannot find (same for NaN if parseInt)
        return get().uniqueNodes.find(x => x.id === parseInt(targetID))
    },

    generateFlowMap: () => {
        if (!get().getFromUniqueNodes(0)) {
            console.log("No Root found when generate flow map")
            return
        }
        var spawnRes = spawnNodes(get().getFromUniqueNodes, 0, -1, 0, 0, false)
        get().setSpawnedNodes(spawnRes.nodeArr)
        get().setSpawnedEdges(spawnRes.edgeArr)
        // console.log("Current spawnedNodes", spawnRes.nodeArr)
        // console.log("Current spawnedEdges", spawnRes.edgeArr)
    },

    generateSelectorMap: (targetContent) => {
        var filterdNodes = targetContent.map(c => {
            return get().uniqueNodes.filter(un => un.content.indexOf(c) > -1).map(un => un.id)
        }).flat()

        filterdNodes = [...new Set(filterdNodes)];

        var genRes = {
            nodeArr: [],
            edgeArr: [],
            height: 0,
            count: 0
        }

        filterdNodes.forEach(fn => {
            var spawnRes = spawnNodes(get().getFromUniqueNodes, fn, 0, genRes.height, genRes.count, true)
            genRes.nodeArr.push(spawnRes.nodeArr)
            genRes.edgeArr.push(spawnRes.edgeArr)
            genRes.height = spawnRes.height > genRes.height ? spawnRes.height : genRes.height
            genRes.height++
            genRes.count = spawnRes.count
        })

        genRes.nodeArr = genRes.nodeArr.flat()
        genRes.edgeArr = genRes.edgeArr.flat()

        get().setSelectorSpawnedNodes(genRes.nodeArr)
        get().setSelectorSpawnedEdges(genRes.edgeArr)
    },

    //can be used by both uniqueNodes or spawnedNodes
    getLargestNodeID: (nodes) => {
        return nodes.reduce((x, y) => {
            return x.id > y.id ? x : y
        }, { id: -1 }).id + 1
    },

    // to prevent loop exist (called at first load)
    // order root to be checked last to clear all problem parent-child before checking root
    verifyNoLoop: () => {
        get().uniqueNodes.sort((x, y) => y.id - x.id).forEach(un => {
            var temp = un.childrenID
            un.childrenID = []
            temp.forEach(childID => {
                get().addChildToUniqueNode(un.id, childID)
            })
        })

        //restore sorting order
        get().uniqueNodes.sort((x, y) => x.id - y.id)
    },
    initUniqueNodes: (data) => {
        set({ uniqueNodes: [] })

        if (data === null || data === undefined) {
            console.log("Trying to initUniqueNodes with null")
            return
        }

        data.map(d => {
            get().addUniqueNode(d)
        })
        get().verifyNoLoop()
        get().generateFlowMap()
        get().generateSelectorMap(get().uniqueNodes.map(un => un.content))
    }
}))