export class Node {
    static looper = []

    constructor(props) {
        this.id = props.id
        this.content = props.content
        if (props.childrenID) {
            this.childrenID = props.childrenID
        } else {
            this.childrenID = []
        }
    }

    hasChild(targetID) {
        return this.childrenID.includes(targetID)
    }

    removeDupChildId(targetID) {
        this.removeChildId(targetID)
        this.addChild(targetID)
    }

    removeChildId(targetID) {
        this.childrenID = this.childrenID.filter(id => id !== targetID)
    }

    addChild(targetID) {
        this.childrenID.push(targetID)
    }
}

//todo add spawned node class
export class SpawnedNode {
    static flowMapRatio = {
        x: 200,
        y: 60
    }

    constructor(props) {
        this.id = props.id
        this.node = props.node
        this.position = props.position
        this.data = this.node.content
        this.spawnedChildren = props.spawnedChildren
        this.colorID = props.colorID
    }

    toFlowNode() {
        return {
            id: this.id.toString(),
            position: {
                x: this.position.x * SpawnedNode.flowMapRatio.x,
                y: this.position.y * SpawnedNode.flowMapRatio.y
            },
            data: {
                label: this.node.content,
                colorID: this.colorID
            },
            type: "myCustomNode",
        }
    }
}