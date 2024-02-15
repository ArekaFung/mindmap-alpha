import { useUserStore } from './Store/UserStore.js'
import { useNodesStore } from './Store/NodesStore.js'
import React, { useCallback, useEffect } from 'react';
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Handle,
    Position,
    useReactFlow,
    ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import './styles/flowmap.style.css';
import './styles/selectormap.style.css';

const filter = createFilterOptions();
const zoomRate = 0.8

function MyCustomNode({ data, isConnectable }) {
    return (
        <div className={"my-custom-node my-custom-node-color-" + data.colorID % 7}>
            <label>{data.label}</label>
            <Handle type="target" id="TL" position={Position.Left} isConnectable={false} />
            <Handle type="target" id="TR" position={Position.Right} isConnectable={false} />

            <Handle type="source" id="SL" position={Position.Left} isConnectable={false} />
            <Handle type="source" id="SR" position={Position.Right} isConnectable={false} />
        </div>
    );
}

const nodeTypes = { myCustomNode: MyCustomNode }

export const SelectorMap = () => {
    const selectorSpawnedNodes = useNodesStore(state => state.selectorSpawnedNodes)
    const selectorSpawnedEdges = useNodesStore(state => state.selectorSpawnedEdges)

    return (
        <div className='selectormap-container'>
            <ReactFlowProvider>
                <QueryPanel></QueryPanel>
                <ReactFlow
                    nodes={selectorSpawnedNodes}
                    edges={selectorSpawnedEdges}
                    nodeTypes={nodeTypes}
                    fitView={true}
                    selectNodesOnDrag={false}
                    panOnDrag={false}
                    nodesDraggable={false}
                    onScroll={(e) => console.log(e)}
                    panOnScroll={true}

                    zoomOnDoubleClick={false}
                    zoomOnScroll={false}
                    minZoom={zoomRate}
                    preventScrolling={false}
                >
                    <Background id="sm-bg" variant="lines" gap={12} />
                </ReactFlow>
            </ReactFlowProvider>
        </div>
    );
}

const QueryPanel = () => {
    const uniqueNodes = useNodesStore(state => state.uniqueNodes)
    const generateFlowMap = useNodesStore(state => state.generateFlowMap)
    const generateSelectorMap = useNodesStore(state => state.generateSelectorMap)
    const addUniqueNode = useNodesStore(state => state.addUniqueNode)
    const addChildToUniqueNode = useNodesStore(state => state.addChildToUniqueNode)
    const reactFlow = useReactFlow();
    const activeBoard = useNodesStore(state => state.activeBoard)
    const uid = useUserStore(state => state.uid)

    const [parentValue, setParentValue] = React.useState(null);
    const [childValue, setChildValue] = React.useState(null);

    useEffect(() => {
        if (!(parentValue || childValue)) {
            updateSelectorMap(uniqueNodes.map(un => un.content))
        } else {
            updateSelectorMap([parentValue?.content, childValue?.content])
        }
    }, [parentValue, childValue])

    useEffect(() => {
        setParentValue(null)
        setChildValue(null)
        updateSelectorMap(uniqueNodes.map(un => un.content))
    }, [activeBoard, uid])

    function filterNodes(event) {
        if (event) {
            if (event.type === 'click') {
                return
            }

            updateSelectorMap([event.target.value])
        }
    }

    function updateSelectorMap(targetValue) {
        generateSelectorMap(targetValue)
        setTimeout(() => {
            reactFlow.fitView({ minZoom: zoomRate, maxZoom: zoomRate })
        }, 50);
    }



    function onSubmit() {
        // if (parentValue === null && childValue === null) return
        console.log(parentValue)
        console.log(childValue)

        var parentNode = parentValue
        var childNode = childValue

        if (parentValue && parentValue.id === -1) {
            parentNode = addUniqueNode(parentValue)
            setParentValue(parentNode)
        }

        if (childValue && childValue.id === -1) {
            childNode = addUniqueNode(childValue)
        }
        setChildValue(null)

        if (parentNode && childNode) {
            addChildToUniqueNode(parentNode.id, childNode.id)
        }

        generateFlowMap()
    }

    return (
        <div class="queryPanel-container">
            <Stack direction="column" spacing={1} >
                <Stack direction="row" spacing={2} justifyContent="space-around" >
                    <Button style={{ width: "45%" }} variant="contained" onClick={onSubmit}>Connect</Button>
                    <Button style={{ width: "45%" }} variant="contained" onClick={() => {
                        setChildValue(null)
                        setParentValue(null)
                    }}>Reset</Button>
                </Stack>
                <Autocomplete
                    style={{ backgroundColor: "white" }}
                    onInputChange={filterNodes}
                    value={parentValue}
                    onChange={(event, newValue) => {
                        if (typeof newValue === 'string') {
                            setParentValue({
                                addLabel: `Add: "${newValue}"`,
                                content: newValue,
                                id: -1
                            });
                        } else if (newValue && newValue.addLabel) {
                            // Create a new value from the user input
                            setParentValue({
                                addLabel: newValue.addLabel,
                                content: newValue.content,
                                id: -1
                            });
                        } else {
                            setParentValue(newValue);
                        }
                    }}
                    filterOptions={(options, params) => {
                        const filtered = filter(options, params);

                        const { inputValue } = params;
                        // Suggest the creation of a new value
                        const isExisting = options.some((option) => inputValue === option.content);
                        if (inputValue !== '' && !isExisting) {
                            filtered.push({
                                addLabel: `Add: "${inputValue}"`,
                                content: inputValue,
                            });
                        }
                        console.log(filtered)

                        return filtered;
                    }}
                    clearOnBlur
                    clearOnEscape
                    handleHomeEndKeys
                    id="suggest-text-field-parent"
                    options={uniqueNodes}
                    getOptionLabel={(option) => {
                        // Value selected with enter, right from the input
                        if (typeof option === 'string') {
                            return option;
                        }
                        // Add "xxx" option created dynamically
                        if (option.addLabel) {
                            return option.addLabel;
                        }
                        // Regular option
                        return option.content;
                    }}
                    renderOption={(props, option) => <li {...props} key={option.id}>{option.addLabel ? option.addLabel : option.content}</li>}
                    sx={{ width: 300 }}
                    freeSolo
                    renderInput={(params) => (
                        <TextField {...params} label="Parent Node" />
                    )}
                />

                <Autocomplete
                    style={{ backgroundColor: "white" }}
                    onInputChange={filterNodes}
                    value={childValue}
                    onChange={(event, newValue) => {
                        if (typeof newValue === 'string') {
                            setChildValue({
                                addLabel: `Add: "${newValue}"`,
                                content: newValue,
                                id: -1
                            });
                        } else if (newValue && newValue.addLabel) {
                            // Create a new value from the user input
                            setChildValue({
                                addLabel: newValue.addLabel,
                                content: newValue.content,
                                id: -1
                            });
                        } else {
                            setChildValue(newValue);
                        }
                    }}
                    filterOptions={(options, params) => {
                        const filtered = filter(options, params);

                        const { inputValue } = params;
                        // Suggest the creation of a new value
                        const isExisting = options.some((option) => inputValue === option.content);
                        if (inputValue !== '' && !isExisting) {
                            filtered.push({
                                addLabel: `Add: "${inputValue}"`,
                                content: inputValue,
                            });
                        }

                        return filtered;
                    }}
                    clearOnBlur
                    clearOnEscape
                    handleHomeEndKeys
                    id="suggest-text-field-child"
                    options={uniqueNodes}
                    getOptionLabel={(option) => {
                        // Value selected with enter, right from the input
                        if (typeof option === 'string') {
                            return "option";
                        }
                        // Add "xxx" option created dynamically
                        if (option.addLabel) {
                            return option.addLabel;
                        }
                        // Regular option
                        return option.content;
                    }}
                    renderOption={(props, option) => <li {...props} key={option.id}>{option.addLabel ? option.addLabel : option.content}</li>}
                    sx={{ width: 300 }}
                    freeSolo
                    renderInput={(params) => (
                        <TextField {...params} label="Child Node" />
                    )}
                />
            </Stack>
        </div>
    )
}

export const FlowMap = () => {
    const spawnedNodes = useNodesStore(state => state.spawnedNodes)
    const spawnedEdges = useNodesStore(state => state.spawnedEdges)

    return (
        <div className='flowmap-container'>
            <ReactFlowProvider>
                <ReactFlow
                    nodes={spawnedNodes}
                    edges={spawnedEdges}
                    nodeTypes={nodeTypes}
                    nodesDraggable={false}
                    elementsSelectable={false}
                    fitView={true}
                    minZoom={0.1}
                >
                    <Controls />
                    <MiniMap />
                    <Background id="fm-bg" variant="dots" gap={12} size={1} />
                </ReactFlow>
            </ReactFlowProvider>
        </div>
    );
}