import { SpawnedNode } from './NodeData.js'
import { MarkerType } from 'reactflow'

const flowMapRatio = {
    x: 200,
    y: 60
}


export const spawnNodes = (getFromUniqueNodes, targetID, depth, height, count, isSelector) => {
    // var spawnRes = recurSpawnNodes(targetID, depth, height, count)

    // if(isSelector){
    //     if(spawnRes!=null){
    //         spawnRes.nodeArr = spawnRes.nodeArr.slice(1)
    //     }
    // }

    // return spawnRes

    return recurSpawnNodes(targetID, depth, height, count)

    function recurSpawnNodes(targetID, depth, height, count) {
        var targetNode = getFromUniqueNodes(targetID)
        // console.log("recur ", targetID, depth, height, count, isSelector, targetNode)

        if (targetNode === null || targetNode === undefined) {
            console.log("Non existing Child during spawn: ", targetID)
            return null
        }

        if (isSelector && depth > 1) {
            // console.log("Over depth during spawn: ", targetID)
            return null
        }

        var self = new SpawnedNode({
            id: (count).toString(),
            node: targetNode,
            position: {
                x: depth,
                y: height
            },
            spawnedChildren: []
        })

        if (!isSelector) {
            self.colorID = self.position.x
        } else {
            self.colorID = -2
        }

        var nodeArr = [self]

        var edgeArr = []

        count++
        depth++

        targetNode.childrenID.forEach(childID => {
            // recursion
            var spawnRes = recurSpawnNodes(childID, depth, height, count)

            if (spawnRes !== null) {
                edgeArr.push({
                    id: self.id + ' - ' + (count).toString(),
                    source: self.id.toString(),
                    sourceHandle: "SR",
                    target: (count).toString(),
                    targetHandle: "TL",
                    type: "smoothstep",
                    animated: true,
                    markerEnd: {
                        type: MarkerType.ArrowClosed,
                        color: '#FF0072',
                    },
                    style: {
                        strokeWidth: 2,
                        stroke: '#FF0072',
                    },
                })

                //accumulate nodes and edges
                self.spawnedChildren.push(spawnRes.self)
                nodeArr.push(spawnRes.nodeArr)
                edgeArr.push(spawnRes.edgeArr)

                //get the max height and inherit count from recursion result
                height = spawnRes.height > height ? spawnRes.height : height
                count = spawnRes.count

                //increase height for each child
                height++
            } else {
                // console.log("Non existing Child during spawn: ", childID)
                // targetNode.removeChildId(childID)
            }
        })

        //as single child does not increase height, reduce height by 1 (if spawned at least one child)
        if (targetNode.childrenID.length > 0) {
            height--
        }

        return {
            self: self,
            nodeArr: nodeArr.flat(),
            edgeArr: edgeArr.flat(),
            height: height,
            count: count
        }
    }

}