import { IReactFlowNodeProps, ReactFlowEdgeProps } from '~/model/MapPage/reactFlowProps'
import { NodeChange } from 'reactflow'
import { BaseStoreProps } from '../baseStoreProps'

export interface BaseMapStoreProps extends BaseStoreProps {
    spawnedNodes: IReactFlowNodeProps[],
    spawnedEdges: ReactFlowEdgeProps[],
    setSpawnedNodes: (inSpawnedNodes: IReactFlowNodeProps[]) => void,
    setSpawnedEdges: (inSpawnedEdges: ReactFlowEdgeProps[]) => void,

    onNodesChange: (changes: NodeChange[]) => void
}