import { create } from 'zustand'
import { BaseStoreProps, SaveableStoreProps } from '~/store/baseStoreProps'
import { useMainMapStore } from '~/store/mainMapStore'
import { useUniqueNodeStore } from '~/store/uniqueNodeStore'
import { BoardInfoSaveData, BoardNodesSaveData } from '~/model/saveDataProps'
import saveParser from '~/util/saveParserUtil'
import { useSelectorMapStore } from './selectorMapStore'

const maxHistoryDataCount: number = 20

interface BoardStoreProps extends BaseStoreProps, SaveableStoreProps<BoardNodesSaveData> {
    activeBoard: number | null,
    availableBoard: BoardInfoSaveData[],
    // editHistoryData: BoardNodesSaveData[],
    // redoHistoryData: BoardNodesSaveData[],
    editHistoryDataString: string[],
    redoHistoryDataString: string[],

    setActiveBoard: (activeBoard: number) => void,
    setAvailableBoard: (availableBoard: BoardInfoSaveData[]) => void,
    addEditHistoryData: () => void,
    revertAddEditHistoryData: () => void,
    undoEditData: () => void,
    redoEditData: () => void,
    resetEditHistory: () => void
}

export const useBoardStoreProps = create<BoardStoreProps>((set, get) => ({
    reset: () => {
        set({
            activeBoard: null,
            availableBoard: [],
        })
    },
    toSaveDataString: () => {
        return saveParser.boardNodes.createSaveDataString(get().toSaveData())
    },
    readSaveDataString: (saveData: string) => {
        const res = saveParser.boardNodes.readSaveDataString(saveData)
        get().readSaveData(res)
    },
    toSaveData: () => {
        return ({
            mainMapSaveData: useMainMapStore.getState().toSaveData(),
            uniqueNodeSaveData: useUniqueNodeStore.getState().toSaveData()
        })
    },
    readSaveData: (saveData: BoardNodesSaveData) => {
        useUniqueNodeStore.getState().readSaveData(saveData.uniqueNodeSaveData)
        useMainMapStore.getState().readSaveData(saveData.mainMapSaveData)
    },

    activeBoard: null,
    availableBoard: [],
    editHistoryDataString: [],
    redoHistoryDataString: [],


    setActiveBoard: (activeBoard: number) => {
        set({ activeBoard })
    },
    setAvailableBoard: (availableBoardData: any[]) => {
        const availableBoard: BoardInfoSaveData[] = []
        availableBoardData.forEach(bd => {
            if (bd?.id !== undefined && bd?.id !== null && bd?.title != undefined && bd?.title != null) {
                availableBoard.push({
                    id: bd.id,
                    title: bd.title
                })
            }
        })

        set({ availableBoard })
    },
    addEditHistoryData: () => {
        //if check length before saving, the max amount of history saves is actually 1 extra

        get().editHistoryDataString.push(get().toSaveDataString())
        get().redoHistoryDataString = []

        if (get().editHistoryDataString.length > maxHistoryDataCount) {
            get().editHistoryDataString.splice(0, get().editHistoryDataString.length - maxHistoryDataCount)
        }

        console.log("[Board] Added edit history, current length: ", get().editHistoryDataString)
    },
    revertAddEditHistoryData: () => {
        get().editHistoryDataString.pop()
        console.log("[Board] Reverted edit history, current length: ", get().editHistoryDataString)
    },
    undoEditData: () => {
        //TODO bug fix for when 1. prune a child, 2. restore, 3. prune again, 4. not pruned in main map but is pruned in selector map
        const latestDataString = get().editHistoryDataString.pop()
        // const latestData = get().editHistoryData.at(-1)
        if (latestDataString !== undefined) {
            get().redoHistoryDataString.push(get().toSaveDataString())
            get().readSaveDataString(latestDataString)
            useSelectorMapStore.getState().reset()
            useSelectorMapStore.getState().generateSelectorMap([''])
        } else {
            // alert("Undo without anymore history")
        }

        console.log("[Board] Undo edit history, current length: ", get().editHistoryDataString)
    },
    redoEditData: () => {
        const latestUndidDataString = get().redoHistoryDataString.pop()
        if (latestUndidDataString !== undefined) {
            get().editHistoryDataString.push(get().toSaveDataString())
            get().readSaveDataString(latestUndidDataString)
            useSelectorMapStore.getState().reset()
            useSelectorMapStore.getState().generateSelectorMap([''])
        } else {
            // alert("Redo without anymore history")
        }

        console.log("[Board] Redo edit history, current length: ", get().editHistoryDataString)
    },
    resetEditHistory: () => {
        get().editHistoryDataString = []
        get().redoHistoryDataString = []
    }
}))
