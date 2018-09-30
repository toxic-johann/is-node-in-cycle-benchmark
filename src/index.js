const { Graph, json } = require('@dagrejs/graphlib');
const Benchmark = require('benchmark');
const benchmarks = require('beautify-benchmark');
const tooMuchEdgesObj = require('./lib/too-much-edges');
const normalObj = require('./lib/normal');
const algDetect = require('./detectors/alg');
const checkIfInCycleThroughDfs = require('./detectors/dfs');
const dfsWithoutSinksAndSources = require('./detectors/dfs-without-sinks-and-sources');

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

function test(originObj) {
    const originGraph = json.read(originObj);
    const edges = originGraph.edges();
    const suite = new Benchmark.Suite();
    if (edges.length < 1000) {
        suite.add(
            '使用检阅图中是否有环，再判断节点是否在环中的低效算法',
            function() {
                const graph = new Graph();
                edges.forEach((v, w) => {
                    algDetect(v, graph);
                    graph.setEdge(v, w);
                    algDetect(v, graph);
                });
            }
        );
    }
    suite
        .add('不检查图中是否有环，只作图迁移', function() {
            const graph = new Graph();
            edges.forEach((v, w) => {
                graph.setEdge(v, w);
            });
        })
        .add('仅使用深度搜索', function () {
            const graph = new Graph();
            edges.forEach((v, w) => {
                try {
                    checkIfInCycleThroughDfs(graph, v, graph.successors(v));
                    graph.setEdge(v, w);
                    checkIfInCycleThroughDfs(graph, v, graph.successors(v));
                } catch(error) {
                    console.error(error)
                }
            });
        })
        .add('使用深度搜索并排除边缘节点', function () {
            const graph = new Graph();
            edges.forEach((v, w) => {
                dfsWithoutSinksAndSources(v, graph);
                graph.setEdge(v, w);
                dfsWithoutSinksAndSources(v, graph);
            });
        })
        .add('使用深度搜索，排除边缘节点，并增加结果缓存', function () {
            const graph = new Graph();
            edges.forEach((v, w) => {
                nodeCycleCache = {};
                isNodeInCycle(v, graph);
                graph.setEdge(v, w);
                isNodeInCycle(v, graph);
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

test(normalObj);
test(tooMuchEdgesObj);
