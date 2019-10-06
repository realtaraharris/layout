'use strict';

const {clearTerminal} = require('./lib/util');

clearTerminal();

require('./core');
require('./layout');
require('./geometry');
require('../lib/csg/test/csg');
require('../lib/font-metrics/test/font-metrics');
require('./picking');
require('./logging');
