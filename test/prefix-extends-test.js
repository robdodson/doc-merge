var generate = require('../index.js');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');

var FIXTURES = path.join(__dirname, 'fixtures');
var OUTPUT = path.join(__dirname, 'tmp');
var PREFIX = ['foo', 'bar'];

function clean() {
  rimraf.sync(OUTPUT);
}

function reset() {
  clean();
  mkdirp.sync(OUTPUT);
  generate(FIXTURES, OUTPUT, { prefix: PREFIX });
}

describe('prefix :: extends', function() {

  before(function() {
    reset();
  });

  var pathToFooExtendee = path.join(OUTPUT, 'foo-extendee.json');
  var pathToBarExtender = path.join(OUTPUT, 'bar-extender.json');

  describe('output', function() {
    
    it('should generate a JSON file for foo-extendee', function() {
      var exists = fs.existsSync(pathToFooExtendee);
      assert.ok(exists);
    });

    it('should generate a JSON file for bar-extender', function() {
      var exists = fs.existsSync(pathToBarExtender);
      assert.ok(exists);
    });

  });

  describe('bar-extender content', function() {
    var content;

    before(function() {
      content = JSON.parse(fs.readFileSync(pathToBarExtender, 'utf-8'))
    });

    it('should contain an extends section', function() {
      assert.ok(content.extends);
      assert.ok(content.extends.length);
    });

    it('should extend foo-extendee', function() {
      assert.ok(content.extends[0].name == 'foo-extendee');
    });

  });
  
});
