var generate = require('../index.js');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');

var FIXTURES = path.join(__dirname, 'fixtures');
var OUTPUT = path.join(__dirname, 'tmp');
var PREFIX = ['script'];

function clean() {
  rimraf.sync(OUTPUT);
}

function reset() {
  clean();
  mkdirp.sync(OUTPUT);
  generate(FIXTURES, OUTPUT, {prefix: PREFIX});
}

describe('prefix :: script fix', function() {

  before(function() {
    reset();
  });

  var pathToScriptElement = path.join(OUTPUT, 'script-fix.json');

  describe('script-fix content', function() {
    
    var content;

    before(function() {
      content = JSON.parse(fs.readFileSync(pathToScriptElement, 'utf-8'));
    });

    it('should escape closing script tags', function() {
      var re = /<\\\/\s?script>/ig;
      var found = content.description.match(re);
      assert.ok(found.length === 2);
    });

  });

});
