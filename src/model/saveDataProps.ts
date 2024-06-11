import { IReactFlowNodeProps, ReactFlowEdgeProps } from '~/model/reactFlowProps'
import { UniqueNodeProps } from '~/model/UniqueNode'


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
