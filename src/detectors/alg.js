const { alg } = require('@dagrejs/graphlib');
module.exports = function(id, graph) {
  if (alg.isAcyclic(graph)) {
    const cycles = alg.findCycles(graph);
    cycles.reduce((flag, cycle) => flag || cycle.indexOf(id) > -1, false);
  }
};
