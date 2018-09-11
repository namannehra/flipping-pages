const getChildrenArr = children => {
    if (Array.isArray(children)) {
        return children
    }
    if (children === undefined || children === false || children === true || children === null) {
        return []
    }
    return [children]
}

export default getChildrenArr