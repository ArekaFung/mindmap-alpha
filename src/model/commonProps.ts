import { IReactFlowNodeProps, ReactFlowEdgeProps } from './reactFlowProps'

export interface GenRes {
    nodeArr: IReactFlowNodeProps[]
    edgeArr: ReactFlowEdgeProps[]
    mapPos: Position2D
    targetSpawnedNodeID: number
}
export interface SpawnRes extends GenRes {
    self: IReactFlowNodeProps
}