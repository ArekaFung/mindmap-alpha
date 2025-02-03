import { IReactFlowNodeProps, ReactFlowEdgeProps } from '~/model/reactFlowProps'
import { NodeChange } from 'reactflow'
import { MainMapSaveData } from '~/model/saveDataProps'

export interface BaseStoreProps {
    reset: () => void,
}

export interface SaveableStoreProps<T> {
    toSaveDataString: () => string,
    readSaveDataString: (saveData: string) => void,
    toSaveData: () => T,
    readSaveData: (saveData: T) => void,
}

export interface BaseMapStoreProps extends BaseStoreProps {
    spawnedNodes: IReactFlowNodeProps[],
    spawnedEdges: ReactFlowEdgeProps[],
    setSpawnedNodes: (inSpawnedNodes: IReactFlowNodeProps[]) => void,
    setSpawnedEdges: (inSpawnedEdges: ReactFlowEdgeProps[]) => void,

    onNodesChange: (changes: NodeChange[]) => void
}