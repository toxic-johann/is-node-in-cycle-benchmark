module.exports = function checkIfInCycleThroughDfs(graph, targetId, nodes, checkedMap = {}) {
    // 防御性编程
    if (!nodes || !nodes.length) return false;
    for (const key in nodes) {
        const id = nodes[key];
        if (id === targetId) return true;
        // 节点已经检查过，忽略
        if (checkedMap[id]) continue;
        checkedMap[id] = true;
        const successors = graph.successors(id) || [];
        if (!successors.length) continue;
        // 顺便需要深度遍历继任
        if (checkIfInCycleThroughDfs(graph, targetId, successors, checkedMap)) {
            return true;
        }
    }
    return false;
}
