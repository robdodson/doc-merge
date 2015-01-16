var generate = require('./index.js');
var path = require('path');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');

var FIXTURES = path.join(__dirname, 'test/fixtures');
var OUTPUT = path.join(__dirname, 'test/tmp');

// Clean and recreate output dir
rimraf.sync(OUTPUT);
mkdirp.sync(OUTPUT);

generate(FIXTURES, OUTPUT, {merge: true});
