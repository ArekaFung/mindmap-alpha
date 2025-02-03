import { create } from 'zustand'
import { UniqueNodeProps, UniqueNode } from '~/model/UniqueNode'
import { UniqueNodeSaveData } from '~/model/saveDataProps'
import { BaseStoreProps, SaveableStoreProps } from '~/store/baseStoreProps'
import saveParser from '~/util/saveParserUtil'

interface UniqueNodeStoreProps extends BaseStoreProps, SaveableStoreProps<UniqueNodeSaveData> {
    uniqueNodes: UniqueNode[],

    initUniqueNodes: (data: UniqueNodeProps[]) => void
    addUniqueNode: (nodeProp: UniqueNodeProps) => UniqueNode,
    getFromUniqueNodes: (targetID: number) => UniqueNode | null | undefined,
    getLargestUniqueNodeID: () => number,

    addChildToUniqueNode: (parentID: number, childID: number) => boolean,
    checkLoopExist: (parentID: number, childID: number) => boolean,
    clearLoop: () => void,
    pruneChildFromUniqueNode: (parentID: number, childID: number) => void,
}


export const useUniqueNodeStore = create<UniqueNodeStoreProps>((set, get) => ({
    reset: () => {
        set({
            uniqueNodes: [],
        })
    },
    toSaveDataString: () => {
        return saveParser.uniqueNode.createSaveDataString(get().toSaveData())
    },
    readSaveDataString: (saveData: string) => {
        const res = saveParser.uniqueNode.readSaveDataString(saveData)
        get().readSaveData(res)
    },
    toSaveData: () => {
        return ({
            nodeArr: [...get().uniqueNodes]
        })
    },
    readSaveData: (saveData: UniqueNodeSaveData) => {
        //TODO add saveParser checking
        // const res = saveParser.mainMap.readSaveDataString(saveData)

        get().initUniqueNodes(saveData.nodeArr)
    },

    uniqueNodes: [],

    initUniqueNodes: (data: UniqueNodeProps[]) => {
        set({ uniqueNodes: [] })

        if (data === null || data === undefined) {
            console.log("Trying to initUniqueNodes with null")
            return
        }

        data.map(d => {
            get().addUniqueNode(d)
        })
        get().clearLoop()
    },
    addUniqueNode: (nodeProp: UniqueNodeProps) => {
        if (nodeProp.id === null || nodeProp.id === undefined || nodeProp.id < 0) {
            nodeProp.id = get().getLargestUniqueNodeID() + 1
        }

        if (nodeProp.childrenID === null || nodeProp.childrenID === undefined) {
            nodeProp.childrenID = []
        }

        const res = new UniqueNode(nodeProp)
        get().uniqueNodes.push(res)
        return res
    },
    getFromUniqueNodes: (targetID: number) => {
        if (targetID === null || targetID === undefined) {
            console.log("Null target to get from uniqueNodes");
            return null
        }

        //note: will return undefined if cannot find (same for NaN if parseInt)
        return get().uniqueNodes.find(x => x.id === targetID)
    },
    getLargestUniqueNodeID: () => {
        return get().uniqueNodes.reduce((x, y) => {
            return x.id > y.id ? x : y
        }, { id: -1 }).id
    },

    addChildToUniqueNode: (parentID: number, childID: number) => {
        const parentNode = get().getFromUniqueNodes(parentID)
        if (parentNode === null || parentNode === undefined) {
            console.log("Null parent: ", parentID, childID)
            return false
        }

        const childNode = get().getFromUniqueNodes(childID)
        if (childNode === null || childNode === undefined) {
            console.log("Null child: ", parentID, childID)
            parentNode.removeChildId(childID)
            return false
        }

        if (childID === 0) {
            console.log("Root as child detected: ", parentID, childID)
            parentNode.removeChildId(childID)
            return false
        }

        if (childID === parentID) {
            console.log("Self detected: ", parentID, childID)
            parentNode.removeChildId(childID)
            return false
        }

        if (parentNode.hasChild(childID)) {
            console.log("Existing child detected: ", parentID, childID)
            parentNode.removeDupChildId(childID)
            return false
        }

        if (get().checkLoopExist(parentID, childID)) {
            console.log("Loop detected: ", parentID, childID)
            parentNode.removeChildId(childID)
            return false
        }

        parentNode.addChild(childID)
        return true
    },
    checkLoopExist: (parentID: number, targetID: number) => {
        const looper: number[] = [parentID]

        function recurCheckLoop(targetID: number): boolean {
            if (looper.includes(targetID)) {
                return true;
            }

            const uniqueNode = get().getFromUniqueNodes(targetID)
            if (uniqueNode === null || uniqueNode === undefined) {
                throw ("Cannot get unique node in checkLoopExist")
            }

            if (uniqueNode.childrenID.length == 0) {
                return false;
            }

            looper.push(targetID)

            for (var childID of uniqueNode.childrenID) {
                if (recurCheckLoop(childID)) {
                    return true
                }
            }

            looper.pop()
            return false
        }

        return recurCheckLoop(targetID)
    },
    clearLoop: () => {
        // try to start from the furthest from root
        // whenever loop is detected, the child will be removed
        // in the end, try to keep as much for the closer to root
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
    pruneChildFromUniqueNode: (targetParentID: number, targetChildID: number) => {
        const parentNode = get().getFromUniqueNodes(targetParentID)
        if (parentNode === null || parentNode === undefined) {
            console.log("Null parent for pruneChildFromUniqueNode: ", targetParentID, targetChildID)
            return
        }

        parentNode.removeChildId(targetChildID)
    }
}))