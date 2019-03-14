const lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('./material/2019-03-14-1.txt'),
});

const babar = require('babar');
const asciichart = require('asciichart');
const edgesCountSavedByRangeNodesMap = {};
const edgesCountSavedByRowColNodesMap = {};

lineReader.on('line', function(line) {
  const {
    formulaNodesCount,
    rangeNodesCount,
    rangeNodesReferencedTimes,
    edgesCountSavedByRangeNodes,
    rowColNodesCount,
    rowColNodesReferencedTimes,
    edgesCountSavedByRowColNodes,
    nodesCount,
    edgesCount,
    dvNodesCount,
  } = JSON.parse(line);
  if (rangeNodesCount > 0) {
    // const edgesCountSavedByRangeNodesMark = Math.min(~~(edgesCountSavedByRangeNodes / rangeNodesCount), 50);
    const edgesCountSavedByRangeNodesMark = Math.sign(edgesCountSavedByRangeNodes) * Math.min(Math.abs(edgesCountSavedByRangeNodes), 400);
    edgesCountSavedByRangeNodesMap[edgesCountSavedByRangeNodesMark] = edgesCountSavedByRangeNodesMap[edgesCountSavedByRangeNodesMark] || 0;
    edgesCountSavedByRangeNodesMap[edgesCountSavedByRangeNodesMark]++;
    edgesCountSavedByRangeNodesMap[edgesCountSavedByRangeNodesMark] = edgesCountSavedByRangeNodesMap[edgesCountSavedByRangeNodesMark] || 0;
    edgesCountSavedByRangeNodesMap[edgesCountSavedByRangeNodesMark]++;
  }

  if (rowColNodesCount > 0) {
    // const edgesCountSavedByRowColNodesMark = Math.min(~~(edgesCountSavedByRowColNodes / rowColNodesCount), 50);
    const edgesCountSavedByRowColNodesMark = Math.sign(edgesCountSavedByRowColNodes) * Math.min(Math.abs(edgesCountSavedByRowColNodes), 400);
    edgesCountSavedByRowColNodesMap[edgesCountSavedByRowColNodesMark] = edgesCountSavedByRowColNodesMap[edgesCountSavedByRowColNodesMark] || 0;
    edgesCountSavedByRowColNodesMap[edgesCountSavedByRowColNodesMark]++;
    edgesCountSavedByRowColNodesMap[edgesCountSavedByRowColNodesMark] = edgesCountSavedByRowColNodesMap[edgesCountSavedByRowColNodesMark] || 0;
    edgesCountSavedByRowColNodesMap[edgesCountSavedByRowColNodesMark]++;
  }
  // console.log('Line from file:', line);
}).on('close', () => {
  edgesCountSavedByRangeNodesMap[410] = 0;

  console.warn(edgesCountSavedByRangeNodesMap);
  console.warn(edgesCountSavedByRowColNodesMap);
  console.log(babar(Object.entries(edgesCountSavedByRangeNodesMap), {
    // color: 'green',
    width: 150,
    height: 20,
    // maxY: 1000,
    // yFractions: 1,
  }));
  console.log(babar(Object.entries(edgesCountSavedByRowColNodesMap), {
    // color: 'green',
    width: 150,
    height: 20,
    // maxY: 1000,
    // yFractions: 1,
  }));
});
