export const logicCheckLoop = (getFromUniqueNodes, rootID, targetID) => {
    const looper = [rootID]

    function recurCheckLoop(targetID) {
        if (looper.includes(targetID)) {
            return true;
        }

        var uniqueNode = getFromUniqueNodes(targetID)
        if (uniqueNode.childrenID.length == 0) {
            return false;
        }

        looper.push(targetID)

        for (var childID of uniqueNode.childrenID) {
            if (recurCheckLoop(childID)) {
                return true
            }
        }

        looper.pop()
        return false
    }

    return recurCheckLoop(targetID)
}

export const logicAddChild = (getFromUniqueNodes, parentID, childID) => {
    // TODO can consider improve the checkings and returns
    var result = true

    var parentNode = getFromUniqueNodes(parentID)
    if (parentNode === null || parentNode === undefined) {
        console.log("Null parent: ", parentID, childID)
        return false
    }

    var childNode = getFromUniqueNodes(childID)
    if (childNode === null || childNode === undefined) {
        console.log("Null childID: ", parentID, childID)
        parentNode.removeChildId(childID)
        return false
    }

    if (childID === 0) {
        console.log("Root as child detected: ", parentID, childID)
        parentNode.removeChildId(childID)
        return false
    }

    if (childID === parentID) {
        console.log("Self detected: ", parentID, childID)
        parentNode.removeChildId(childID)
        return false
    }

    if (parentNode.hasChild(childID)) {
        console.log("Existing child detected: ", parentID, childID)
        parentNode.removeDupChildId(childID)
        return false
    }

    if (logicCheckLoop(getFromUniqueNodes, parentID, childID)) {
        console.log("Loop detected: ", parentID, childID)
        parentNode.removeChildId(childID)
        return false
    }

    if (result !== false) parentNode.addChild(childID)

    return result
}