import { create } from 'zustand'
import { IReactFlowNodeProps } from '~/model/reactFlowProps'
import { applyNodeChanges, NodeChange } from 'reactflow'
import { useUniqueNodeStore } from '~/store/uniqueNodeStore'
import { nodePadding, spawnNodes, adjustNodesByPadding, getMaxChildHeightRelative } from '~/util/mapStoreUtil'
import { UniqueNodeProps } from '~/model/UniqueNode'
import { BaseMapStoreProps } from '~/store/baseStoreProps'
import { GenRes } from '~/model/commonProps'

interface SelectorMapStoreProps extends BaseMapStoreProps {
    parentValue: UniqueNodeProps | null,
    childValue: UniqueNodeProps | null,
    inputValue: string,
    setParentValue: (parentValue: UniqueNodeProps | null) => void,
    setChildValue: (childValue: UniqueNodeProps | null) => void,
    setInputValue: (inputValue: string) => void,
    generateSelectorMap: (targetContent: string[]) => void,
}

export const useSelectorMapStore = create<SelectorMapStoreProps>((set, get) => ({
    reset: () => {
        set({
            spawnedNodes: [],
            spawnedEdges: [],
            parentValue: null,
            childValue: null,
            inputValue: ''
        })
    },

    spawnedNodes: [],
    spawnedEdges: [],
    parentValue: null,
    childValue: null,
    inputValue: '',

    setSpawnedNodes: (spawnedNodes) => set({ spawnedNodes }),
    setSpawnedEdges: (spawnedEdges) => set({ spawnedEdges }),
    setParentValue: (parentValue) => set({ parentValue }),
    setChildValue: (childValue) => set({ childValue }),
    setInputValue: (inputValue) => set({ inputValue }),

    onNodesChange: (changes: NodeChange[]) => { },

    generateSelectorMap: (targetContent: string[]) => {
        const filterdNodes = new Set(targetContent.map(c => {
            return useUniqueNodeStore.getState().uniqueNodes.filter(un => un.content.indexOf(c) > -1).map(un => un.id)
        }).flat())

        const genRes: GenRes = {
            nodeArr: [],
            edgeArr: [],
            mapPos: { x: 0, y: 0 },
            targetSpawnedNodeID: 0
        }

        filterdNodes.forEach(fn => {
            const spawnRes = spawnNodes(fn, genRes.mapPos, 'monoNode', { x: 0, y: 0 }, genRes.targetSpawnedNodeID, true)

            if (spawnRes !== null) {
                const padding = getMaxChildHeightRelative(spawnRes.self, spawnRes.nodeArr)

                genRes.nodeArr.push(...spawnRes.nodeArr)
                genRes.edgeArr.push(...spawnRes.edgeArr)
                genRes.mapPos.y += padding + nodePadding.y
                genRes.targetSpawnedNodeID = spawnRes.targetSpawnedNodeID
            }
        })

        set({
            spawnedNodes: genRes.nodeArr,
            spawnedEdges: genRes.edgeArr
        })
    },
}))

