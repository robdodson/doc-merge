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
  generate(FIXTURES, OUTPUT, { config: 'test/fixtures/config.json' });
}

describe('config extends', function() {

  before(function() {
    reset();
  });

  var pathToXExtender = path.join(OUTPUT, 'x-extender.json');
  var pathToXExtendee = path.join(OUTPUT, 'x-extendee.json');

  describe('output', function() {
    
    it('should generate a JSON file for x-extender', function() {
      var exists = fs.existsSync(pathToXExtender);
      assert.ok(exists);
    });

    it('should generate a JSON file for x-extendee', function() {
      var exists = fs.existsSync(pathToXExtendee);
      assert.ok(exists);
    });

  });

  describe('x-extender content', function() {
    var content;

    before(function() {
      content = JSON.parse(fs.readFileSync(pathToXExtender, 'utf-8'))
    });

    it('should contain an extends section', function() {
      assert.ok(content.extends);
      assert.ok(content.extends.length);
    });

    it('should extend x-extendee', function() {
      assert.ok(content.extends[0].name == 'x-extendee');
    });

  });
  
});
