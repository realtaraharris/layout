'use strict';

function leftPad(distance, character) {
  let scratch = '';
  for (let i = 0; i < distance; i++) {
    scratch += character;
  }
  return scratch;
}

function fixed(number) {
  if (typeof number === 'number') {
    return number.toFixed(2);
  }
  return '-';
}

function printBox({x, y, width, height}) {
  return `x: ${fixed(x)} y: ${fixed(y)} width: ${fixed(width)} height: ${fixed(
    height
  )}`;
}

function printChildBoxes(childBoxes, padding) {
  if (childBoxes) {
    return childBoxes
      .map(childBox => `${padding}${printBox(childBox)}`)
      .join('\n');
  }
  return `${padding}-`;
}

function printChildBoxCount(childBoxes, subPadding) {
  if (!childBoxes) {
    return ': -';
  }
  if (childBoxes.length === 1) {
    return `: ${printChildBoxes(childBoxes, '')}`;
  }
  return ` (${childBoxes.length}):\n${printChildBoxes(childBoxes, subPadding)}`;
}

function cleanupChildBoxes(rawChildBoxes) {
  const childBoxes = rawChildBoxes && rawChildBoxes.filter(Boolean);
  if (childBoxes && childBoxes.length > 0) {
    return childBoxes;
  }
}

function printTree(component, depth) {
  const box = component.instance.box && component.instance.box;
  const childBoxes = cleanupChildBoxes(component.instance.childBoxes);

  const {name} = component.instance.constructor;

  const padding = leftPad(depth * 2, ' ');
  const subPadding = padding + '  ';
  console.log(
    `${padding}${name}\n${subPadding}box: ${printBox(
      box
    )}\n${subPadding}childBoxes${printChildBoxCount(childBoxes, subPadding)}`
  );

  for (let child of component.children) {
    printTree(child, depth + 1);
  }
}

module.exports = {printTree};
