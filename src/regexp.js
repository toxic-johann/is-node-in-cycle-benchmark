const Benchmark = require('benchmark');
const benchmarks = require('beautify-benchmark');


const suite = new Benchmark.Suite();
suite
  .add('正则', function() {
    /^col-/.test('12313213');
    /^col-/.test('col-123123');
  })
  .add('indexof', function() {
    '123123123'.toLowerCase();
    typeof '12313213' === 'string' && '12313213'.indexOf('col-') === 0;
    typeof '12313213' === 'string' && 'col-12313213'.indexOf('col-') === 0;
  })
  .add('正则1', function() {
    /^(?:position|temp|row|col|cross-sheet-temp|range)-/i.test(12312312312312323);
  })
  .add('indexof2', function() {
    '123123123'.toLowerCase();
    'position'.indexOf('12312312') === 0;
    'temp'.indexOf('12312312') === 0;
    'row'.indexOf('12312312') === 0;
    'col'.indexOf('12312312') === 0;
    'cross-sheet-temp'.indexOf('12312312') === 0;
    'range'.indexOf('12312312') === 0;
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
