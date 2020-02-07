'use strict';

const util = require('../lib/util');

util.test('components', 'text');
util.test('components', 'text-concave-cutout');
util.test('components', 'text-diamond'); // TODO: rename to text-diamond-bounding-polygon
util.test('components', 'text-long', {dumpTree: true});
util.test('components', 'text-no-debug-boxes');
