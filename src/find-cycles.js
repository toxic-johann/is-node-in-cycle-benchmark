const { Graph, json, alg } = require('@dagrejs/graphlib');
const Benchmark = require('benchmark');
const benchmarks = require('beautify-benchmark');
const tooMuchEdgesObj = require('./lib/too-much-edges');
const normalObj = require('./lib/normal');
const algDetect = require('./detectors/alg');
const checkIfInCycleThroughDfs = require('./detectors/dfs');
const dfsWithoutSinksAndSources = require('./detectors/dfs-without-sinks-and-sources');
const {
  isNodeInCycle: dfsWithoutSinksAndSourcesWithCache,
  clearCache,
} = require('./detectors/dfs-without-sinks-and-sources-with-cache');

function test(originObj) {
  const originGraph = json.read(originObj);
  const suite = new Benchmark.Suite();
  suite
    .add('使用库算法算出图中所有环', function() {
      alg.findCycles(originGraph);
    })
    .add('使用深度搜索，排除边缘节点，找出所有环节点', function() {
      const cycles = [];
      originGraph.nodes().forEach(id => {
        if (dfsWithoutSinksAndSources(id, originGraph)) {
          cycles.push(id);
        }
      });
    })
    // add listeners
    .on('cycle', function(event) {
      benchmarks.add(event.target);
    })
    .on('complete', function() {
      benchmarks.log();
    })
    // run async
    .run({ async: true });
}

// test(normalObj);
test(tooMuchEdgesObj);
