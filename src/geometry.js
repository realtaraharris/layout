'use strict';

const comparator = (a, b) => (a > b ? 1 : a < b ? -1 : 0);

// swiped from https://stackoverflow.com/a/33697671
function insertSorted(array, item) {
  let min = 0;
  let max = array.length;

  // get the index we need to insert the item at
  let index = Math.floor((min + max) / 2);
  while (max > min) {
    if (comparator(item, array[index]) < 0) {
      max = index;
    } else {
      min = index + 1;
    }
    index = Math.floor((min + max) / 2);
  }

  // check for duplicate items behind and ahead of insertion point
  /*
  const ahead = (index < (max - 1)) && array[index + 1]
  const behind = (index > 0) && array[index - 1]
  if (item === ahead || item === behind) {
    return
  }
  */

  // insert the item
  array.splice(index, 0, item);
}

const EPSILON = 0.000001;
function intersect(lineA, lineB) {
  const [x1, y1, x2, y2] = lineA;
  const [x3, y3, x4, y4] = lineB;

  const denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

  // if denominator is zero, lineA and lineB are parallel
  if (Math.abs(denominator) < EPSILON) {
    return;
  }

  const uA = (x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3);
  const uB = (x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3);

  const uAd = uA / denominator;
  const uBd = uB / denominator;

  const intersectionX = x1 + uAd * (x2 - x1);
  const intersectionY = y1 + uAd * (y2 - y1);

  // coincident line case
  if (
    Math.abs(uAd) < EPSILON &&
    Math.abs(uBd) < EPSILON &&
    Math.abs(denominator) < EPSILON
  ) {
    return;
  }

  if (uAd >= 0 && uAd <= 1 && uBd >= 0 && uBd <= 1) {
    return [intersectionX, intersectionY];
  }
}

function checkPoint([x, y], [boxX, boxY, boxWidth, boxHeight]) {
  return (
    x >= boxX && y >= boxY && x <= boxX + boxWidth && y <= boxY + boxHeight
  );
}

function intersectAabb(boxA, [xB, yB, widthB, heightB]) {
  return (
    checkPoint([xB, yB], boxA) ||
    checkPoint([xB + widthB, yB], boxA) ||
    checkPoint([xB, yB + heightB], boxA) ||
    checkPoint([xB + widthB, yB + heightB], boxA)
  );
}

module.exports = {intersect, intersectAabb, insertSorted};
