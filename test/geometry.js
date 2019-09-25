'use strict';

const tape = require('tape-catch');
const {clearTerminal} = require('./lib/util');
const {
  circularDoublingIterator,
  circularDoublingPeekingIterator
} = require('../src/util');

const {intersect, intersectAabb} = require('../src/geometry');

clearTerminal();

tape('empty circular peeking iterator', t => {
  const loopIterator = circularDoublingIterator();
  let output = loopIterator.next().value; // position 0
  t.deepEquals(output, undefined);

  output = loopIterator.next().value; // position 1
  t.deepEquals(output, undefined);

  t.end();
});

tape('circular peeking iterator', t => {
  const star = [
    [12, 0],
    [9.1639, 8.7],
    [0, 2],
    [7.4806, 14.0654],
    [4.6, 22.8],
    [11.9573, 17.3906],
    [19.4, 22.8],
    [16.5651, 14.0654],
    [24, 8.7],
    [14.8237, 8.7]
  ];

  const loopIterator = circularDoublingIterator(star);
  let output = loopIterator.next().value; // position 0

  t.deepEquals(output, [12, 0, 9.1639, 8.7]);

  output = loopIterator.next().value; // position 1
  t.deepEquals(output, [9.1639, 8.7, 0, 2]);

  for (let i = 0; i < 8; i++) {
    loopIterator.next(); // skip over positions 2 -> 9
  }

  output = loopIterator.next().value; // position 10
  t.deepEquals(output, [12, 0, 9.1639, 8.7]);

  t.end();
});

tape('intersection', t => {
  const lineA = [0, 0, 1, 1]; // bottom-left -> top-right
  const lineB = [0, 1, 1, 0]; // top-left -> bottom-right

  const actual = intersect(lineA, lineB);

  t.deepEquals(actual, [0.5, 0.5], 'midpoint found');

  t.end();
});

tape('empty circular doubling peeking iterator', t => {
  const loopIterator = circularDoublingPeekingIterator();
  let output = loopIterator.next().value; // position 0
  t.deepEquals(output, undefined);

  output = loopIterator.next().value; // position 1
  t.deepEquals(output, undefined);

  t.end();
});

tape('circular doubling peeking iterator', t => {
  const star = [
    [12, 0],
    [9.1639, 8.7],
    [0, 2],
    [7.4806, 14.0654],
    [4.6, 22.8],
    [11.9573, 17.3906],
    [19.4, 22.8],
    [16.5651, 14.0654],
    [24, 8.7],
    [14.8237, 8.7]
  ];

  const loopIterator = circularDoublingPeekingIterator(star);
  let output = loopIterator.next().value; // position 0
  t.deepEquals(output.previousLine, [14.8237, 8.7, 12, 0]);
  t.deepEquals(output.currentLine, [12, 0, 9.1639, 8.7]);
  t.deepEquals(output.nextLine, [9.1639, 8.7, 0, 2]);

  output = loopIterator.next().value; // position 1
  t.deepEquals(output.previousLine, [12, 0, 9.1639, 8.7]);
  t.deepEquals(output.currentLine, [9.1639, 8.7, 0, 2]);
  t.deepEquals(output.nextLine, [0, 2, 7.4806, 14.0654]);

  for (let i = 0; i < 8; i++) {
    loopIterator.next(); // skip over positions 2 -> 9
  }

  output = loopIterator.next().value; // position 10
  t.deepEquals(output.previousLine, [14.8237, 8.7, 12, 0]);
  t.deepEquals(output.currentLine, [12, 0, 9.1639, 8.7]);
  t.deepEquals(output.nextLine, [9.1639, 8.7, 0, 2]);

  t.end();
});

tape('intersection', t => {
  const lineA = [0, 0, 1, 1]; // bottom-left -> top-right
  const lineB = [0, 1, 1, 0]; // top-left -> bottom-right

  const actual = intersect(lineA, lineB);

  t.deepEquals(actual, [0.5, 0.5], 'midpoint found');

  t.end();
});

tape('intersect bounding boxes', t => {
  const boxA = [0, 0, 1, 1];
  const boxB = [0.5, 0.5, 1, 1];

  t.equals(intersectAabb(boxA, boxB), true, 'boxes overlap');

  const boxC = [2, 2, 1, 1];
  t.equals(intersectAabb(boxA, boxC), false, `boxes don't overlap`);

  const boxD = [1, 1, 1, 1];
  t.equals(intersectAabb(boxA, boxD), true, 'barely touching boxes overlap');

  t.end();
});
