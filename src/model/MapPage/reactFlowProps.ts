import { CustomNodeType } from './customNodeTypes'
import { CustomEdgePropsProps } from './customEdgePropsTypes'
import { UniqueNode } from './uniqueNode'



export interface IReactFlowNodeProps {
    id: string
    //position is relative to parent node
    position: Position2D
    type: CustomNodeType
    parentNode?: string
    data: IReactFlowNodeDataProps
}

export interface IReactFlowNodeDataProps {
    uniqueNode: UniqueNode
    childrenID: string[] //id of spawned nodes (not unique nodes)
    treePos: Position2D
}

export type ColorNodeProps = IReactFlowNodeProps & {
    data: {
        colorID: number
    }
}

export type SelectorNodeProps = IReactFlowNodeProps & {
    data: {
        parentSpawnedNodeID: string | undefined
        thisSpawnedNodeID: string
    }
}




export interface ReactFlowEdgeProps extends CustomEdgePropsProps {
    id: string
    source: string
    target: string
}