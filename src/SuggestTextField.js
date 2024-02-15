import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { useNodesStore } from './Store/NodesStore.js'
import { formControlLabelClasses } from '@mui/material';

const filter = createFilterOptions();

export default function FreeSoloCreateOption() {
    const [parentValue, setParentValue] = React.useState(null);
    const [childValue, setChildValue] = React.useState(null);

    const uniqueNodes = useNodesStore(state => state.uniqueNodes)
    const addUniqueNode = useNodesStore(state => state.addUniqueNode)
    const addChildToUniqueNode = useNodesStore(state => state.addChildToUniqueNode)

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
            setChildValue(childNode)
        }

        if (parentNode && childNode) {
            addChildToUniqueNode(parentNode.id, childNode.id)
        }
    }

    return (
        <>
            <button onClick={onSubmit}>click</button>
            <button onClick={() => console.log(uniqueNodes)}>click2</button>
            <Autocomplete
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

                    return filtered;
                }}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                id="suggest-text-field-parent"
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
                    <TextField {...params} label="Parent Node" />
                )}
            />

            <Autocomplete
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
                selectOnFocus
                clearOnBlur
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
        </>
    );
}
