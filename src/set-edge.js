/* eslint-disable no-loop-func */
const { Graph, json } = require('@dagrejs/graphlib');
const Benchmark = require('benchmark');
const benchmarks = require('beautify-benchmark');
const asciichart = require('asciichart');
const babar = require('babar');

function test() {
  const suite = new Benchmark.Suite();
  const allChartSources = [];
  const graphSizes = [[], [], [], []];
  const graphs = [ new Graph(), new Graph(), new Graph() ];
  let max = 1;
  for (let cursor = 0; cursor < graphs.length; cursor++) {
    max = max + 100000;
    for (let i = 1; i < max; i++) {
      graphs[cursor].setEdge(i + 0.1, i + 0.7);
    }
    ((cursor, edges) => {
      let i = 0;
      suite.add(`已有 ${edges} 条边`, function() {
        const max = i + 150;
        for (; i < max; i++) {
          graphs[cursor].setEdge(i, i + 0.5);
        }
        graphSizes[cursor].push(i);
      });
    })(cursor, max);
  }

  let cursor = 0;
  suite
    // add listeners
    .on('cycle', function(event) {
      benchmarks.add(event.target);
      const samples = event.target.stats.sample.map((i, index) => [ graphSizes[cursor][index], i * 1000 ]);
      graphs[cursor] = null;
      cursor++;
      allChartSources.push(samples);
      // console.log(samples.length);
      // // console.log(asciichart.plot(samples));
      // console.log(babar(samples));
      // console.warn('graphs[0]', i1);
      // console.warn('graphs[1]', i2);
    })
    .on('complete', function() {
      benchmarks.log();
      allChartSources.forEach(source => console.log(babar(source)));
      // console.warn('graphs[0]', i1);
      // console.warn('graphs[2]', i3);
    })
    // run async
    .run({ async: true });
}

test();
