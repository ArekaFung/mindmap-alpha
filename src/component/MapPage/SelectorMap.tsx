import ReactFlow, {
    ReactFlowProvider,
    Background,
    BackgroundVariant,
} from "reactflow";
import { useSelectorMapStore } from '~/store/MapPage/selectorMapStore'

import { customNodeTypes } from "~/model/MapPage/customNodeTypes";
import SelectorMapListener from '~/listener/MapPage/SelectorMapListener'

import QueryPanel from '~/component/MapPage/QueryPanel'
const zoomRate = 0.8

const SelectorMap = () => {
    const spawnedNodes = useSelectorMapStore(state => state.spawnedNodes)
    const spawnedEdges = useSelectorMapStore(state => state.spawnedEdges)

    return (
        <div className="selectormap-container">
            <ReactFlowProvider>
                <SelectorMapListener></SelectorMapListener>
                <QueryPanel></QueryPanel>
                <ReactFlow
                    nodes={spawnedNodes}
                    edges={spawnedEdges}
                    nodeTypes={customNodeTypes}
                    fitView={true}
                    selectNodesOnDrag={false}
                    panOnDrag={false}
                    nodesDraggable={false}
                    onScroll={(e) => console.log(e)} //TODO is this working or what?
                    panOnScroll={true}
                    zoomOnDoubleClick={false}
                    zoomOnScroll={false}
                    minZoom={zoomRate}
                    preventScrolling={false}
                >
                    <Background
                        id="sm-bg"
                        variant={BackgroundVariant.Lines}
                        gap={12}
                    />
                </ReactFlow>
            </ReactFlowProvider>
        </div>
    );
};

export default SelectorMap;


