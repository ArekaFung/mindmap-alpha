import {
    MarkerType,
} from 'reactflow'


// for data in ReactFlow, not the actual "types" used by ReactFlow
export type CustomEdgePropsType = 'defaultEdgeProps'
export type CustomEdgePropsTypeProps = {
    [key in CustomEdgePropsType]: CustomEdgePropsProps;
}

export interface CustomEdgePropsProps {
    sourceHandle: string
    targetHandle: string
    type: string
    animated: boolean
    markerEnd: {
        type: MarkerType
        color: string
    }
    style: {
        strokeWidth: number
        stroke: string
    }
}


export const customEdgePropsTypes: CustomEdgePropsTypeProps = {
    'defaultEdgeProps': {
        sourceHandle: "SR",
        targetHandle: "TL",
        type: "smoothstep",
        animated: true,
        markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#FF0072',
        },
        style: {
            strokeWidth: 2,
            stroke: '#FF0072',
        },
    }
}
