'use strict';

const util = require('./lib/util');

util.test('shrinking-flow-box-horizontal-left-with-margin');
util.test('shrinking-flow-box-horizontal-right-with-margin');
util.test('shrinking-flow-box-vertical-left-with-margin');
util.test('vertical');
util.test('vertical-right'); // TODO: rename to vertical-layout-right-aligned
util.test('shrinking-flow-box-no-children');
util.test('shrinking-flow-box-vertical-right');
util.test('shrinking-flow-box-vertical-center');
util.test('shrinking-flow-box-horizontal-center');
util.test('shrinking-flow-box-diagonal-center');
util.test('shrinking-flow-box-horizontal-right');
util.test('shrinking-flow-box-vertical-center-with-margin');

util.test('expanding-flow-box-simple');
util.test('expanding-flow-box-nested');
util.test('expanding-flow-box-expand-shrink');

util.test('complex-nested');
util.test('margin');
util.test('horizontal');
util.test('diagonal');
util.test('mixed'); // TODO: rename to mixed-layout-no-margins
util.test('viewport');
util.test('checkbox-checked');
util.test('checkbox-unchecked');
