'use strict';

const tape = require('tape-catch');
const {clearTerminal} = require('../../../test/lib/util');
const {createCanvas} = require('canvas');
const FontMetrics = require('../src/index');

const {helveticaNormal20, helveticaNormal100} = require('./fixtures');

const testSetup = () => createCanvas(600, 600).getContext('2d');

const runFontMetricsTest = (
  renderContext,
  {typeStyle, expectedMeasurements},
  t
) => t.deepEquals(FontMetrics(renderContext, typeStyle), expectedMeasurements);

const timeIt = timedFunction => {
  const start = process.hrtime.bigint(); // requires node 10.7.0
  timedFunction();
  return process.hrtime.bigint() - start;
};

const timeTestsInSeries = (renderContext, testFixtures, t) =>
  timeIt(() => {
    for (let fixture of testFixtures) {
      runFontMetricsTest(renderContext, fixture, t);
    }
  });

clearTerminal();

tape('polygon subtraction', t => {
  const duration = timeIt(() => {
    runFontMetricsTest(testSetup(), helveticaNormal20, t);
  });
  t.comment(`took ${duration} nanoseconds`);
  t.end();
});

tape('polygon subtraction, big', t => {
  const duration = timeIt(() => {
    runFontMetricsTest(testSetup(), helveticaNormal100, t);
  });
  t.comment(`took ${duration} nanoseconds`);
  t.end();
});

tape('verify internal state is consistent after happy path', t => {
  const renderContext = testSetup();

  // do 100 point measurement. won't be cached
  runFontMetricsTest(renderContext, helveticaNormal100, t);
  // do 20 point measurement. won't be cached
  runFontMetricsTest(renderContext, helveticaNormal20, t);

  t.end();
});

tape('verify cache speeds up measurement', t => {
  const renderContext = testSetup();

  const delta0 = timeTestsInSeries(
    renderContext,
    [(helveticaNormal100, helveticaNormal20)],
    t
  );

  // they ought to run correctly in the opposite order`
  const delta1 = timeTestsInSeries(
    renderContext,
    [(helveticaNormal20, helveticaNormal100)],
    t
  );

  // ensure that cache returns them faster the second time
  t.ok(delta1 < delta0);
  t.comment(`cache saved ${delta0 - delta1} nanoseconds`);
  t.end();
});
