import data from './data.js'
import { useEffect, useState } from 'react'

import { useNodesStore } from './Store/NodesStore.js'
import { useUserStore } from './Store/UserStore.js'

import { SelectorMap, FlowMap } from './FlowMap.js'


const List = () => {
    return (
        <>
            <div style={{ display: 'flex', textAlign:'center' }}>
                <SelectorMap />
                <FlowMap />
            </div>
        </>
    )
}


export default List