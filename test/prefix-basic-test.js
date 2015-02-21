var generate = require('../index.js');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');

var FIXTURES = path.join(__dirname, 'fixtures');
var OUTPUT = path.join(__dirname, 'tmp');
var PREFIX = ['seed'];

function clean() {
  rimraf.sync(OUTPUT);
}

function reset() {
  clean();
  mkdirp.sync(OUTPUT);
  generate(FIXTURES, OUTPUT, {prefix: PREFIX});
}

describe('prefix :: basic', function() {

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

    it('should contain a description for the seed-element', function() {
      assert.ok(content.description);
    });

    it('should contain a blurb for the seed-element', function() {
      assert.ok(content.blurb);
    });

    it('should contain a status for the seed-element', function() {
      assert.ok(content.status);
    });

    it('should contain a homepage for the seed-element', function() {
      assert.ok(content.homepage);
    });

    it('should contain attributes for the seed-element', function() {
      assert.ok(content.attributes);
      assert.ok(content.attributes.length);
    });

    it('should contain properties for the seed-element', function() {
      assert.ok(content.properties);
      assert.ok(content.properties.length);
    });

    it('should contain methods for the seed-element', function() {
      assert.ok(content.methods);
      assert.ok(content.methods.length);
    });

    it('should contain events for the seed-element', function() {
      assert.ok(content.events);
      assert.ok(content.events.length);
    });

    it('should contain a location for the seed-element', function() {
      assert.ok(content.location);
      assert.ok(content.location.length);
    });

  });

});
