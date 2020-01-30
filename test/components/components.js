'use strict';

const util = require('../lib/util');

util.test('components', 'box', {dumpTree: false});
util.test('components', 'root-shrinking-flow-box-labels', {dumpTree: false});
util.test('components', 'expanding-margin', {dumpTree: false});
util.test('components', 'shrinking-margin', {dumpTree: false});
util.test('components', 'horizontal-simple', {dumpTree: false});
util.test('components', 'horizontal', {dumpTree: false});
util.test('components', 'vertical', {dumpTree: false});

util.test('components', 'shrinking-flow-box-diagonal-center', {
  dumpTree: false
});
util.test('components', 'shrinking-flow-box-horizontal-right', {
  dumpTree: false
});
util.test('components', 'viewport', {dumpTree: false});
util.test('components', 'expanding-flow-box-rectangle', {dumpTree: false});
util.test('components', 'expanding-flow-box-simple-rectangle', {
  dumpTree: false
});
util.test('components', 'shrinking-flow-box-horizontal-left-with-margin', {
  dumpTree: false
});
util.test('components', 'expanding-flow-box-text', {dumpTree: false});
util.test('components', 'expanding-flow-box-expand-shrink', {dumpTree: false});

util.test('components', 'shrinking-flow-box-horizontal-right-with-margin');
util.test('components', 'shrinking-flow-box-vertical-left-with-margin');
util.test('components', 'vertical-right'); // TODO: rename to vertical-layout-right-aligned
util.test('components', 'shrinking-flow-box-no-children');
util.test('components', 'shrinking-flow-box-vertical-right');
util.test('components', 'shrinking-flow-box-vertical-center', {
  dumpTree: false
});
util.test('components', 'shrinking-flow-box-horizontal-center');
util.test('components', 'shrinking-flow-box-vertical-center-with-margin');
util.test('components', 'expanding-flow-box-simple');
util.test('components', 'expanding-flow-box-nested');
util.test('components', 'complex-nested');
util.test('components', 'diagonal');
util.test('components', 'mixed'); // TODO: rename to mixed-layout-no-margins
util.test('components', 'checkbox-checked');
util.test('components', 'checkbox-unchecked');
