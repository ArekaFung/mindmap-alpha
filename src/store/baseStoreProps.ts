export interface BaseStoreProps {
    reset: () => void,
}

export interface SaveableStoreProps<T> {
    toSaveDataString: () => string,
    readSaveDataString: (saveData: string) => void,
    toSaveData: () => T,
    readSaveData: (saveData: T) => void,
}