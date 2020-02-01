'use strict';

const {clearTerminal} = require('./lib/util');

clearTerminal();

require('./core/core');
require('./components/components');
require('./components/text');
require('./geometry');
require('../lib/csg/test/csg');
require('./picking/picking');
// require('./logging');
