import data from './data.js'
import { useEffect, useState } from 'react'

import { useNodesStore } from './Store/NodesStore.js'
import { useUserStore } from './Store/UserStore.js'

import { SelectorMap, FlowMap } from './FlowMap.js'


const List = () => {
    return (
        <>
            <div style={{ display: 'flex' }}>
                <SelectorMap />
                <FlowMap />
            </div>
        </>
    )
}


export default List