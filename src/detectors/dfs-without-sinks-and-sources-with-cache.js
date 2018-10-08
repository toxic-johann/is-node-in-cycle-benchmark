let nodeCycleCache = {};

function isNodeInCycle(id, graph) {
    graph.hasNode(id);
    // 没有节点，不用管
    if (!graph.hasNode(id)) return false;
    const cacheResult = nodeCycleCache[id];
    if (cacheResult !== undefined) {
        return cacheResult;
    }
    const predecessors = graph.predecessors(id);
    const successors = graph.successors(id);
    // 节点没有出度或者入度，不用管
    if (
        !predecessors ||
        !predecessors.length ||
        !successors ||
        !successors.length
    ) {
        nodeCycleCache[id] = false;
        return false;
    }
    const result = checkIfInCycleThroughDfs(graph, id, successors);
    nodeCycleCache[id] = result;
    return result;
}

function clearCache() {
    nodeCycleCache = {};
}

module.exports = {
    isNodeInCycle,
    clearCache,
}
