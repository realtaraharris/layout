'use strict';

const util = require('../lib/util');

util.test('components', 'text');
util.test('components', 'text-concave-cutout');
util.test('components', 'text-diamond'); // TODO: rename to text-diamond-bounding-polygon
util.test('components', 'text-long', {dumpTree: false});
util.test('components', 'text-no-debug-boxes');
util.test('components', 'multiple-text-continuation-groups');
