import { useEffect, useState } from "react";
import { useUniqueNodeStore } from '~/store/uniqueNodeStore'
import { useSelectorMapStore } from '~/store/selectorMapStore'
import { useEventActionStore } from '~/store/eventActionStore'

const SelectorMapListener = () => {
    const uniqueNodes = useUniqueNodeStore(state => state.uniqueNodes)

    const parentValue = useSelectorMapStore(state => state.parentValue)
    const childValue = useSelectorMapStore(state => state.childValue)
    const inputValue = useSelectorMapStore(state => state.inputValue)

    const [oldPV, sopv] = useState(parentValue)
    const [oldCV, socv] = useState(childValue)

    const generateSelectorMap = useSelectorMapStore(state => state.generateSelectorMap)


    useEffect(() => {
        console.log("generating selector map")
        const filterContent: string[] = []
        if (parentValue !== oldPV || childValue !== oldCV) {
            if (!(parentValue || childValue)) {
                filterContent.push(...uniqueNodes.map(un => un.content))
            } else {
                if (parentValue !== null) {
                    filterContent.push(parentValue.content)
                }
                if (childValue !== null) {
                    filterContent.push(childValue.content)
                }
            }
        } else {
            filterContent.push(inputValue)
        }
        generateSelectorMap(filterContent)

        sopv(parentValue)
        socv(childValue)
    }, [inputValue, parentValue, childValue])


    return (<></>)
};

export default SelectorMapListener;
