const { Graph, json } = require('@dagrejs/graphlib');
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
    const edges = originGraph.nodes().reduce((edges, id) => {
        const node = originGraph.node(id);
        if (!node) return edges;
        const predecessors = originGraph.predecessors(id) || [];
        predecessors.forEach(v => {
            edges.push({ v, w: id });
        });
        return edges;
    }, []);
    const suite = new Benchmark.Suite();
    if (edges.length < 1000) {
        suite.add(
            '使用检阅图中是否有环，再判断节点是否在环中的低效算法',
            function() {
                const graph = new Graph();
                edges.forEach(({ v, w }) => {
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
            edges.forEach(({ v, w }) => {
                graph.setEdge(v, w);
            });
        })
        .add('仅使用深度搜索', function () {
            const graph = new Graph();
            edges.forEach(({ v, w }) => {
                checkIfInCycleThroughDfs(graph, v, graph.successors(v));
                graph.setEdge(v, w);
                checkIfInCycleThroughDfs(graph, v, graph.successors(v));
            });
        })
        .add('使用深度搜索并排除边缘节点', function () {
            const graph = new Graph();
            edges.forEach(({ v, w }) => {
                dfsWithoutSinksAndSources(v, graph);
                graph.setEdge(v, w);
                dfsWithoutSinksAndSources(v, graph);
            });
        })
        .add('使用深度搜索，排除边缘节点，并增加结果缓存', function () {
            const graph = new Graph();
            edges.forEach(({ v, w }) => {
                clearCache();
                dfsWithoutSinksAndSources(v, graph);
                graph.setEdge(v, w);
                dfsWithoutSinksAndSources(v, graph);
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
// test(tooMuchEdgesObj);
