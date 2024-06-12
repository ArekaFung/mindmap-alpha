import {
    useReactFlow,
} from "reactflow";
import { useEffect } from 'react'
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { useUniqueNodeStore } from '~/store/uniqueNodeStore'
import { useSelectorMapStore } from '~/store/selectorMapStore'
import { useEventActionStore } from '~/store/eventActionStore'

import { UniqueNodeProps } from "~/model/UniqueNode";

const zoomRate = 0.8
const filter = createFilterOptions<UniqueNodeProps>();

const QueryPanel = () => {
    const reactFlow = useReactFlow();

    const uniqueNodes = useUniqueNodeStore(state => state.uniqueNodes)
    const spawnedNodes = useSelectorMapStore(state => state.spawnedNodes)
    const spawnedEdges = useSelectorMapStore(state => state.spawnedEdges)
    const parentValue = useSelectorMapStore(state => state.parentValue)
    const childValue = useSelectorMapStore(state => state.childValue)
    const setInputValue = useSelectorMapStore(state => state.setInputValue)
    const setParentValue = useSelectorMapStore(state => state.setParentValue)
    const setChildValue = useSelectorMapStore(state => state.setChildValue)

    const setAction = useEventActionStore(state => state.setAction)

    useEffect(() => {
        setTimeout(() => {
            reactFlow.fitView({ minZoom: zoomRate, maxZoom: zoomRate, nodes: [spawnedNodes[0], spawnedNodes[1]] })
        }, 100);
    }, [spawnedNodes, spawnedEdges])


    //TODO bug fix, bug occur when
    //1. selected an existing item with id, in parent node input box
    //2. un-focus on the input box
    //3. Cannot read properties of undefined (reading 'id')

    return (
        <div className="queryPanel-container">
            <Stack direction="column" spacing={1} >
                <Stack direction="row" spacing={2} justifyContent="space-around" >
                    <Button style={{ width: "45%" }} variant="contained" onClick={() => setAction(null, 'add parent and child 1', null, 'Maintain')}>Connect</Button>
                    <Button style={{ width: "45%" }} variant="contained" onClick={() => {
                        setChildValue(null)
                        setParentValue(null)
                    }}>Reset</Button>
                </Stack>
                <Autocomplete
                    style={{ backgroundColor: "white" }}
                    onInputChange={(event, value): void => {
                        // if user use 'enter' key without highlighting any of the options, the final event fired will be null and after onChange 
                        // if user pick by selecting one of the options (mouse or 'enter' key), onChange event will be fired after last onInputChange event
                        if (event) {
                            setInputValue(value)
                        }
                    }}
                    value={parentValue}
                    onChange={(event, newValue) => {
                        if (typeof newValue === 'string') {
                            setParentValue({
                                id: -1,
                                content: newValue,
                                childrenID: []
                            });
                        } else {
                            setParentValue(newValue);
                        }
                    }}
                    filterOptions={(options, params) => {
                        const filtered = filter(options, params);

                        const { inputValue } = params;
                        // Suggest the creation of a new value
                        // const isExisting = options.some((option) => inputValue === option.content);
                        // if (inputValue !== '' && !isExisting) {
                        if (inputValue !== '') {
                            filtered.push({
                                id: -1,
                                content: inputValue,
                                childrenID: []
                            });
                        }
                        // console.log(filtered)

                        return filtered;
                    }}
                    selectOnFocus
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
                        if (option.id === -1) {
                            return `Add: "${option.content}"`
                        }

                        // Regular option
                        return option.content;
                    }}
                    renderOption={(props, option) => <li {...props} key={option.id}>{option.id === -1 ? `Add: "${option.content}"` : option.content}</li>}
                    sx={{ width: 300 }}
                    freeSolo
                    renderInput={(params) => (
                        <TextField {...params} label="Parent Node" />
                    )}
                />

                <Autocomplete
                    style={{ backgroundColor: "white" }}
                    onInputChange={(event, value): void => {
                        // if user use 'enter' key without highlighting any of the options, the final event fired will be null and after onChange 
                        // if user pick by selecting one of the options (mouse or 'enter' key), onChange event will be fired after last onInputChange event
                        if (event) {
                            setInputValue(value)
                        }
                    }}
                    value={childValue}
                    onChange={(event, newValue) => {
                        if (typeof newValue === 'string') {
                            setChildValue({
                                id: -1,
                                content: newValue,
                                childrenID: []
                            });
                        } else {
                            setChildValue(newValue);
                        }
                    }}
                    filterOptions={(options, params) => {
                        const filtered = filter(options, params);

                        const { inputValue } = params;
                        // Suggest the creation of a new value
                        if (inputValue !== '') {
                            filtered.push({
                                id: -1,
                                content: inputValue,
                                childrenID: []
                            });
                        }

                        return filtered;
                    }}
                    selectOnFocus
                    clearOnBlur
                    clearOnEscape
                    handleHomeEndKeys
                    id="suggest-text-field-child"
                    options={uniqueNodes}
                    getOptionLabel={(option) => {
                        if (typeof option === 'string') {
                            return option;
                        }
                        if (option.id === -1) {
                            return `Add: "${option.content}"`
                        }
                        return option.content;
                    }}
                    renderOption={(props, option) => <li {...props} key={option.id}>{option.id === -1 ? `Add: "${option.content}"` : option.content}</li>}
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

export default QueryPanel