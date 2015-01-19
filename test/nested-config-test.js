var generate = require('../index.js');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');

var FIXTURES = path.join(__dirname, 'fixtures');
var OUTPUT = path.join(__dirname, 'tmp');

function clean() {
  rimraf.sync(OUTPUT);
}

function reset() {
  clean();
  mkdirp.sync(OUTPUT);
  generate(FIXTURES, OUTPUT, {
    config: 'test/fixtures/nested-config/foo/bar/config.json'
  });
}

describe('nested config', function() {

  before(function() {
    reset();
  });

  var pathToSeedElement = path.join(OUTPUT, 'seed-element.json');

  describe('output', function() {
    
    it('should generate a JSON file for the seed-element', function() {
      var exists = fs.existsSync(pathToSeedElement);
      assert.ok(exists);
    });

  });

  describe('seed-element content', function() {
    
    var content;

    before(function() {
      content = JSON.parse(fs.readFileSync(pathToSeedElement, 'utf-8'));
    });

    it('should contain a name for the seed-element', function() {
      assert.ok(content.name);
      assert.ok(content.name == 'seed-element');
    });

  });

});
