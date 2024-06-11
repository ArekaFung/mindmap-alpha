import { ColorNodeProps } from '~/model/reactFlowProps'
import { MainMapSaveData, UniqueNodeSaveData, BoardNodesSaveData } from '~/model/saveDataProps'

interface ISaveParser<T> {
    createSaveDataString: (save: T) => string,
    readSaveDataString: (save: string) => T,
    readSaveData: (save: T) => boolean,
}

interface SaveParserDictionary {
    mainMap: ISaveParser<MainMapSaveData>
    uniqueNode: ISaveParser<UniqueNodeSaveData>
    boardNodes: ISaveParser<BoardNodesSaveData>
}

const defaultCreateSaveDataString = <T>(saveDataString: T): string => {
    return JSON.stringify(saveDataString)
}

const defaultReadSaveDataString = <T>(saveDataString: string): T => {
    //TODO add type-safe checking
    //User-defined type guards
    return JSON.parse(saveDataString) as T
}

const defaultReadSaveData = <T>(saveData: T): boolean => {
    //TODO add type-safe checking
    //User-defined type guards
    return true
}

const test = (saveData: MainMapSaveData): boolean => {
    //TODO add solid type check here
    saveData.nodeArr.forEach((sn) => {
        if (sn.data.childrenID === undefined || sn.data.childrenID === null) {
            sn.data.childrenID = []
        }
        if (sn.type === 'colorNode' && (sn as ColorNodeProps).data.colorID === undefined) {
            (sn as ColorNodeProps).data.colorID = sn.data.treePos.x //reference to mapStoreUtil spawnNodes() for future changes
        }
    })
    return true
}



const saveParser: SaveParserDictionary = {
    mainMap: {
        createSaveDataString: defaultCreateSaveDataString,
        readSaveDataString: defaultReadSaveDataString,
        readSaveData: test
    },
    uniqueNode: {
        createSaveDataString: defaultCreateSaveDataString,
        readSaveDataString: defaultReadSaveDataString,
        readSaveData: defaultReadSaveData
    },
    boardNodes: {
        createSaveDataString: defaultCreateSaveDataString,
        readSaveDataString: defaultReadSaveDataString,
        readSaveData: defaultReadSaveData
    }
}


export default saveParser