export interface UniqueNodeProps {
    id: number
    content: string
    childrenID: number[]
}

export class UniqueNode {
    id: number
    content: string
    childrenID: number[]

    constructor({ id, content, childrenID }: UniqueNodeProps) {
        this.id = id
        this.content = content

        if (childrenID) {
            this.childrenID = childrenID
        } else {
            this.childrenID = []
        }
    }

    hasChild(targetID: number) {
        return this.childrenID.includes(targetID)
    }

    removeDupChildId(targetID: number) {
        this.removeChildId(targetID)
        this.addChild(targetID)
    }

    removeChildId(targetID: number) {
        this.childrenID = this.childrenID.filter(id => id !== targetID)
    }

    addChild(targetID: number) {
        this.childrenID.push(targetID)
    }
}