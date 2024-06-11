import {
    NodeProps,
    Handle,
    Position,
} from 'reactflow'
import { IReactFlowNodeDataProps } from './reactFlowProps';
import { useBoardStoreProps } from '~/store/boardStore'
import { useEventActionStore } from '~/store/eventActionStore'

// direct use for ReactFlow to define types of nodes
export type CustomNodeType = 'colorNode' | 'monoNode'
export type CustomNodeTypeProps = {
    [key in CustomNodeType]: React.ComponentType<NodeProps>;
}


export const customNodeTypes: CustomNodeTypeProps = {
    'colorNode': ColorNode,
    'monoNode': MonoNode,
}

function ColorNode({ data }: NodeProps) {
    const addEditHistoryData = useBoardStoreProps(state => state.addEditHistoryData)

    return (
        <div className={"my-custom-node my-custom-node-color-" + data.colorID % 7} onMouseDownCapture={() => {
            // console.log('clicked color with data: ', data)
            addEditHistoryData()
        }}>
            <BaseNode label={data.uniqueNode.content}></BaseNode>
        </div >
    );
}

function MonoNode({ data }: NodeProps) {
    const setAction = useEventActionStore(state => state.setAction)
    return (
        <div className={"my-custom-node my-custom-node-mono"} onMouseDownCapture={(event) => {
            if (event.ctrlKey || event.metaKey) {
                console.log('clicked mono to prune with data: ', data)
                setAction(null, 'prune child', { pruneParentSpawnedNodeID: data.parentSpawnedNodeID, pruneChildSpawnedNodeID: data.thisSpawnedNodeID }, 'Maintain')
            }
        }}>
            <BaseNode label={data.uniqueNode.content}></BaseNode>
        </div>
    );
}

const BaseNode = ({ label }: { label: string }) => {
    return (
        <>
            <label>{label}</label>
            <Handle type="target" id="TL" position={Position.Left} isConnectable={false} />
            <Handle type="target" id="TR" position={Position.Right} isConnectable={false} />

            <Handle type="source" id="SL" position={Position.Left} isConnectable={false} />
            <Handle type="source" id="SR" position={Position.Right} isConnectable={false} />
        </>
    )
}


