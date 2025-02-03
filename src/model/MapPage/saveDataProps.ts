import { IReactFlowNodeProps, ReactFlowEdgeProps } from './reactFlowProps'
import { UniqueNodeProps } from './uniqueNode'


export interface MainMapSaveData {
    nodeArr: IReactFlowNodeProps[]
    edgeArr: ReactFlowEdgeProps[]
}

export interface UniqueNodeSaveData {
    nodeArr: UniqueNodeProps[]
}

export interface BoardInfoSaveData {
    id: number
    title: string
}

export interface BoardNodesSaveData {
    mainMapSaveData: MainMapSaveData
    uniqueNodeSaveData: UniqueNodeSaveData
}
