'use strict';

const util = require('./lib/util');

util.test('root-shrinking-flow-box-labels', {dumpTree: false});
util.test('margin', {dumpTree: false});
util.test('horizontal-simple', {dumpTree: false});
util.test('horizontal', {dumpTree: false});
util.test('vertical', {dumpTree: false});
util.test('shrinking-flow-box-diagonal-center', {dumpTree: false});
util.test('shrinking-flow-box-horizontal-right', {dumpTree: false});
util.test('viewport', {dumpTree: false});
util.test('expanding-flow-box-rectangle', {dumpTree: false});
util.test('expanding-flow-box-simple-rectangle', {dumpTree: false});
util.test('shrinking-flow-box-horizontal-left-with-margin', {dumpTree: false});
util.test('expanding-flow-box-text', {dumpTree: false});
util.test('expanding-flow-box-expand-shrink', {dumpTree: false});

util.test('shrinking-flow-box-horizontal-right-with-margin');
util.test('shrinking-flow-box-vertical-left-with-margin');
util.test('vertical-right'); // TODO: rename to vertical-layout-right-aligned
util.test('shrinking-flow-box-no-children');
util.test('shrinking-flow-box-vertical-right');
util.test('shrinking-flow-box-vertical-center', {dumpTree: false});
util.test('shrinking-flow-box-horizontal-center');
util.test('shrinking-flow-box-vertical-center-with-margin');
util.test('expanding-flow-box-simple');
util.test('expanding-flow-box-nested');
util.test('complex-nested');
util.test('diagonal');
util.test('mixed'); // TODO: rename to mixed-layout-no-margins
util.test('checkbox-checked');
util.test('checkbox-unchecked');
