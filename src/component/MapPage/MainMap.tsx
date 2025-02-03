import ReactFlow, {
    ReactFlowProvider,
    Controls,
    MiniMap,
    Background,
    BackgroundVariant,
} from "reactflow";

import { useMainMapStore } from '~/store/MapPage/mainMapStore'
import { customNodeTypes } from "~/model/MapPage/customNodeTypes";
import MainMapListener from "~/listener/MapPage/MainMapListener";

const MainMap = () => {
    const spawnedNodes = useMainMapStore(state => state.spawnedNodes)
    const spawnedEdges = useMainMapStore(state => state.spawnedEdges)
    const onNodesChange = useMainMapStore(state => state.onNodesChange)

    return (
        <div className='flowmap-container'>
            <ReactFlowProvider>
                <MainMapListener></MainMapListener>
                <ReactFlow
                    nodes={spawnedNodes}
                    edges={spawnedEdges}
                    onNodesChange={onNodesChange}
                    // onEdgesChange={onEdgesChange}
                    nodeTypes={customNodeTypes}
                    fitView={true}
                    minZoom={0.1}
                    snapToGrid={true}
                    snapGrid={[10, 10]}
                    panOnDrag={[0, 1, 2]}>
                    <Controls />
                    <MiniMap />
                    <Background
                        id="fm-bg"
                        variant={BackgroundVariant.Dots}
                        gap={12}
                        size={1}
                    />
                </ReactFlow>
            </ReactFlowProvider>
        </div>
    );
};

export default MainMap;
