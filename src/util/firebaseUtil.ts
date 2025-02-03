export const checkNotUndefinedNotNull = (actionDesc: string, params: any[]): boolean => {
    for (const param of params) {
        if (param === null || param === undefined) {
            console.log(actionDesc, params)
            return false
        }
    }

    return true
}

export const softCheckNotUndefinedNotNull = (actionDesc: string, params: any[]) => {
    for (const param of params) {
        if (param === null || param === undefined) {
            console.log(actionDesc, params)
            break
        }
    }
}