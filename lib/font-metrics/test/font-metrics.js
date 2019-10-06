'use strict';

const tape = require('tape-catch');
const {clearTerminal, screenshot} = require('../../../test/lib/util');
const {createCanvas} = require('canvas');
const FontMetrics = require('../src/index');

const {
  helveticaNormal20,
  helveticaNormal100,
  timesNormal100
} = require('./fixtures');

const WIDTH = 1200;
const HEIGHT = 1200;
const SCALE_FACTOR = 1;

const testSetup = () => createCanvas(WIDTH, HEIGHT).getContext('2d');

const runFontMetricsTest = (fm, {typeStyle, expectedMeasurements}, t) => {
  const actualMeasurements = fm.measureTypeStyle(typeStyle);
  return t.deepEquals(actualMeasurements, expectedMeasurements);
};

const timeIt = timedFunction => {
  const start = process.hrtime.bigint(); // requires node 10.7.0
  timedFunction();
  const end = process.hrtime.bigint();
  return end - start;
};

const timeTestsInSeries = (fm, testFixtures, t) =>
  timeIt(() => {
    for (let fixture of testFixtures) {
      runFontMetricsTest(fm, fixture, t);
    }
  });

clearTerminal();

tape('measure 20 point helvetica', t => {
  const canvas = createCanvas(WIDTH, HEIGHT);

  const duration = timeIt(() => {
    runFontMetricsTest(
      new FontMetrics(canvas.getContext('2d'), WIDTH, HEIGHT, SCALE_FACTOR),
      helveticaNormal20,
      t
    );
  });
  t.comment(`took ${duration} nanoseconds`);
  screenshot('measure-20-point-helvetica', canvas, t);
});

tape('measure 100 point helvetica', t => {
  const canvas = createCanvas(WIDTH, HEIGHT);

  const duration = timeIt(() => {
    runFontMetricsTest(
      new FontMetrics(canvas.getContext('2d'), WIDTH, HEIGHT, SCALE_FACTOR),
      helveticaNormal100,
      t
    );
  });
  t.comment(`took ${duration} nanoseconds`);
  screenshot('measure-100-point-helvetica', canvas, t);
});

tape('measure 100 point times', t => {
  const canvas = createCanvas(WIDTH, HEIGHT);

  const duration = timeIt(() => {
    runFontMetricsTest(
      new FontMetrics(canvas.getContext('2d'), WIDTH, HEIGHT, SCALE_FACTOR),
      timesNormal100,
      t
    );
  });
  t.comment(`took ${duration} nanoseconds`);

  screenshot('measure-100-point-times', canvas, t);
});

tape('verify internal state is consistent after happy path', t => {
  const fm = new FontMetrics(testSetup(), WIDTH, HEIGHT, SCALE_FACTOR);

  runFontMetricsTest(fm, helveticaNormal100, t);
  runFontMetricsTest(fm, helveticaNormal20, t);

  t.end();
});

tape('verify cache speeds up measurement', t => {
  const fm = new FontMetrics(testSetup(), WIDTH, HEIGHT, SCALE_FACTOR);

  const delta0 = timeTestsInSeries(
    fm,
    [helveticaNormal100, helveticaNormal20],
    t
  );

  // they ought to run correctly in the opposite order`
  const delta1 = timeTestsInSeries(
    fm,
    [helveticaNormal20, helveticaNormal100],
    t
  );

  // ensure that cache returns them faster the second time
  t.ok(delta1 < delta0);
  t.comment(`cache saved ${delta0 - delta1} nanoseconds`);
  t.end();
});

const lineyLine = (renderContext, x1, y1, x2, y2, color) => {
  renderContext.beginPath();
  renderContext.moveTo(x1, y1);
  renderContext.lineTo(x2, y2);
  renderContext.strokeStyle = color;
  renderContext.setLineDash([5, 5]);
  renderContext.stroke();
};

tape('measure character', t => {
  const typeStyle = {
    fontFamily: 'helvetica',
    fontWeight: 'normal',
    fontSize: 400,
    scaleFactor: 1,
    origin: 'baseline'
  };
  const character = 'x';

  const canvas = createCanvas(WIDTH, HEIGHT);
  const renderContext = canvas.getContext('2d');
  const fm = new FontMetrics(renderContext, WIDTH, HEIGHT, SCALE_FACTOR);
  // fm.measureTypeStyle(typeStyle);
  fm.setFont(typeStyle);
  const left = fm.measureLeft(character);
  const right = fm.measureRight(character);
  const top = fm.measureTop(character);
  const bottom = fm.measureBottom(character);

  console.log({left, right, top, bottom});

  const guideLength = 400;

  lineyLine(renderContext, left, 0, left, guideLength, 'green');
  lineyLine(renderContext, right, 0, right, guideLength, 'red');
  lineyLine(renderContext, 0, bottom, guideLength, bottom, 'blue');
  lineyLine(renderContext, 0, top, guideLength, top, 'orange');

  screenshot('measure-character-100-point-helvetica', canvas, t);

  // TODO: replace this!
  const chars = {
    capHeight: 'S',
    baseline: 'n',
    xHeight: 'x',
    descent: 'p',
    ascent: 'h',
    title: 'i'
  };

  const capHeight = fm.measureTop(chars.capHeight);
  lineyLine(renderContext, 0, capHeight, guideLength, capHeight, 'white');
  screenshot('measure-character-100-point-helvetica-cap-height', canvas, t);

  const baseline = fm.measureBottom(chars.baseline);
  lineyLine(renderContext, 0, baseline, guideLength, baseline, 'white');
  screenshot('measure-character-100-point-helvetica-baseline', canvas, t);

  const xHeight = fm.measureTop(chars.xHeight);
  lineyLine(renderContext, 0, xHeight, guideLength, xHeight, 'white');
  screenshot('measure-character-100-point-helvetica-x-height', canvas, t);

  const descent = fm.measureBottom(chars.descent);
  lineyLine(renderContext, 0, descent, guideLength, descent, 'white');
  screenshot('measure-character-100-point-helvetica-descent', canvas, t);

  const lineHeight = fm.computeLineHeight();
  lineyLine(renderContext, 0, lineHeight, guideLength, lineHeight, 'white');
  screenshot('measure-character-100-point-helvetica-line-height', canvas, t);

  const ascent = fm.measureTop(chars.ascent);
  lineyLine(renderContext, 0, ascent, guideLength, ascent, 'white');
  screenshot('measure-character-100-point-helvetica-ascent', canvas, t);

  const title = fm.measureTop(chars.title);
  lineyLine(renderContext, 0, title, guideLength, title, 'white');
  screenshot('measure-character-100-point-helvetica-title', canvas, t);

  // const actualMeasurements = fm.measureTypeStyle(typeStyle);
  console.log(actualMeasurements);
});
