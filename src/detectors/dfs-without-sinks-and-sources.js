const checkIfInCycleThroughDfs = require('./dfs');
module.exports = function isNodeInCycle(id, graph) {
  graph.hasNode(id);
  // 没有节点，不用管
  if (!graph.hasNode(id)) return false;
  const predecessors = graph.predecessors(id);
  const successors = graph.successors(id);
  // 节点没有出度或者入度，不用管
  if (
    !predecessors ||
        !predecessors.length ||
        !successors ||
        !successors.length
  ) {
    return false;
  }
  const result = checkIfInCycleThroughDfs(graph, id, successors);
  return result;
};
