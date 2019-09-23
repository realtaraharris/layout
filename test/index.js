'use strict';

const {clearTerminal} = require('./lib/util');

clearTerminal();

require('./layout');
require('./geometry');
require('../lib/csg/test/csg');
require('./picking');
require('./logging');
