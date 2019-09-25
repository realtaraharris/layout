'use strict';

const {c} = require('../../src/layout');
const {Checkbox} = require('../../src/components/checkbox');
const {Root} = require('../../src/components');

module.exports = ({x, y, width, height}) => {
  return c(
    Root,
    {x, y, width, height, color: 'black'},
    c(Checkbox, {checked: false, color: 'red'})
  );
};
