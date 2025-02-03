import { Node } from 'reactflow'

import { SpawnRes } from '~/model/MapPage/commonProps'
import { IReactFlowNodeProps, IReactFlowNodeDataProps, ColorNodeProps, SelectorNodeProps, ReactFlowEdgeProps } from '~/model/MapPage/reactFlowProps'
import { customEdgePropsTypes } from '~/model/MapPage/customEdgePropsTypes'
import { CustomNodeType } from '~/model/MapPage/customNodeTypes'

import { useUniqueNodeStore } from '~/store/MapPage/uniqueNodeStore'



export const nodePadding: Position2D = {
    x: 200,
    y: 60
}

export const spawnNodes = (uniqueNodeID: number, mapPos: Position2D, nodeType: CustomNodeType, treePos: Position2D, targetSpawnedNodeID: number, isSelector: boolean, parentID?: string): SpawnRes | null => {
    const getFromUniqueNodes = useUniqueNodeStore.getState().getFromUniqueNodes
    return recurSpawnNodes(uniqueNodeID, { ...mapPos }, { ...treePos }, targetSpawnedNodeID, parentID)

    function recurSpawnNodes(uniqueNodeID: number, mapPos: Position2D, treePos: Position2D, targetSpawnedNodeID: number, parentID?: string): SpawnRes | null {
        const targetNode = getFromUniqueNodes(uniqueNodeID)
        // console.log("recur ", uniqueNodeID, depth, height, targetSpawnedNodeID, isSelector, targetNode)

        if (targetNode === null || targetNode === undefined) {
            console.log("Non existing Child during spawn: ", uniqueNodeID)
            return null
        }

        if (isSelector && treePos.x > 1) {
            // console.log("Over depth during spawn: ", uniqueNodeID)
            return null
        }

        const self: IReactFlowNodeProps = {
            id: (targetSpawnedNodeID).toString(),
            position: {
                x: nodePadding.x,
                y: mapPos.y
            },
            type: nodeType,
            parentNode: parentID,
            data: {
                uniqueNode: targetNode,
                childrenID: [],
                treePos: {
                    x: treePos.x,
                    y: 0
                }
            }
        }

        if (!isSelector) {
            (self as ColorNodeProps).data.colorID = treePos.x
        } else {
            (self as SelectorNodeProps).data.parentSpawnedNodeID = parentID;
            (self as SelectorNodeProps).data.thisSpawnedNodeID = (targetSpawnedNodeID).toString();
        }

        const nodeArr: IReactFlowNodeProps[] = [self]
        const edgeArr: ReactFlowEdgeProps[] = []

        targetSpawnedNodeID++

        treePos.x++
        mapPos.y = 0
        targetNode.childrenID.forEach(childID => {
            // recursion
            const spawnRes = recurSpawnNodes(childID, { ...mapPos }, { ...treePos }, targetSpawnedNodeID, self.id)

            if (spawnRes !== null) {
                edgeArr.push({
                    id: self.id + ' - ' + (targetSpawnedNodeID).toString(),
                    source: self.id.toString(),
                    target: (targetSpawnedNodeID).toString(),
                    ...customEdgePropsTypes.defaultEdgeProps
                })

                //accumulate nodes and edges
                self.data.childrenID.push(spawnRes.self.id)
                nodeArr.push(...spawnRes.nodeArr)
                edgeArr.push(...spawnRes.edgeArr)

                //get the max height and inherit targetSpawnedNodeID from recursion result
                mapPos.y += spawnRes.mapPos.y + nodePadding.y
                targetSpawnedNodeID = spawnRes.targetSpawnedNodeID
            } else {
                // console.log("Non existing Child during spawn: ", childID)
                // targetNode.removeChildId(childID)
            }
        })

        //as single child does not increase height, reduce height by 1 (if spawned at least one child)
        if (self.data.childrenID.length > 0) {
            mapPos.y -= nodePadding.y
        }

        return {
            self: self,
            nodeArr: nodeArr.flat(),
            edgeArr: edgeArr.flat(),
            mapPos: mapPos,
            targetSpawnedNodeID: targetSpawnedNodeID
        }
    }
}


export const adjustNodesByPadding = (targetHeightAbsolute: number, padding: number, flowNodes: Node[]) => {
    flowNodes.filter(sn => sn.positionAbsolute?.y !== undefined && sn.positionAbsolute.y > targetHeightAbsolute).forEach((fn) => {
        fn.position.y += padding
        const temp1 = fn.data as IReactFlowNodeDataProps
        temp1.childrenID.forEach(childID => {
            const temp2 = flowNodes.find(fn => fn.id === childID)
            if (temp2 !== undefined) {
                temp2.position.y -= padding
            }
        })
    })
}

export const getMaxChildHeightRelative = (targetNode: IReactFlowNodeProps, spawnedNodes: IReactFlowNodeProps[]): number => {
    return recurgetMaxChildHeightRelative(targetNode) - targetNode.position.y

    function recurgetMaxChildHeightRelative(targetNode: IReactFlowNodeProps): number {
        var highest = targetNode.position.y

        if (targetNode.data.childrenID.length !== 0) {
            targetNode.data.childrenID.forEach(c => {
                const tempNode = spawnedNodes.find(x => x.id === c)
                if (tempNode === undefined) return

                const childrenHighest = recurgetMaxChildHeightRelative(tempNode)
                if (highest < targetNode.position.y + childrenHighest) {
                    highest = targetNode.position.y + childrenHighest
                }
            })
        }

        return highest
    }
}