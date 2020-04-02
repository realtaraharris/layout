'use strict';

const {test, only} = require('../lib/util'); // eslint-disable-line

const suite = 'components';
test(suite, 'context', {dumpTree: false});
test(suite, 'offset-measure', {dumpTree: false});
test(suite, 'expanding-flow-box-simple', {dumpTree: false});
test(suite, 'flow-box-expand-horizontal-shrink-vertical', {dumpTree: false});
test(suite, 'flow-box-combinations', {dumpTree: false});
test(suite, 'twelve-flow-boxes', {dumpTree: false});
test(suite, 'expand-horizontal-shrink-vertical', {dumpTree: false});
test(suite, 'box', {dumpTree: false});
test(suite, 'root-shrinking-flow-box-labels', {dumpTree: false});
test(suite, 'expanding-margin', {dumpTree: false});
test(suite, 'shrinking-margin', {dumpTree: false});
test(suite, 'horizontal-simple', {dumpTree: false});
test(suite, 'horizontal', {dumpTree: false});
test(suite, 'vertical', {dumpTree: false});
test(suite, 'shrinking-flow-box-diagonal-center', {dumpTree: false});
test(suite, 'shrinking-flow-box-horizontal-right', {dumpTree: false});
test(suite, 'viewport', {dumpTree: false});
test(suite, 'expanding-flow-box-rectangle', {dumpTree: false});
test(suite, 'expanding-flow-box-simple-rectangle', {dumpTree: false});
test(suite, 'shrinking-flow-box-horizontal-left-with-margin', {
  dumpTree: false
});
test(suite, 'expanding-flow-box-text', {dumpTree: false});
test(suite, 'expanding-flow-box-expand-shrink', {dumpTree: false});
test(suite, 'shrinking-flow-box-horizontal-right-with-margin', {
  dumpTree: false
});
test(suite, 'shrinking-flow-box-vertical-left-with-margin', {dumpTree: false});
test(suite, 'vertical-right', {dumpTree: false});
test(suite, 'shrinking-flow-box-no-children', {dumpTree: false});
test(suite, 'shrinking-flow-box-vertical-right');
test(suite, 'shrinking-flow-box-vertical-center', {dumpTree: false});
test(suite, 'shrinking-flow-box-horizontal-center');
test(suite, 'shrinking-flow-box-vertical-center-with-margin');
test(suite, 'expanding-flow-box-nested', {dumpTree: false});
test(suite, 'complex-nested');
test(suite, 'diagonal');
test(suite, 'mixed');
test(suite, 'checkbox-checked');
test(suite, 'checkbox-unchecked');
