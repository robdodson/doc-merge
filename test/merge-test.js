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
  generate(FIXTURES, OUTPUT, { merge: true });
}

describe('merge', function() {

  before(function() {
    reset();
  });

  var pathToXMerger = path.join(OUTPUT, 'x-merger.json');

  describe('output', function() {
    
    it('should generate a JSON file for the x-merger', function() {
      var exists = fs.existsSync(pathToXMerger);
      assert.ok(exists);
    });

  });

  describe('x-merger content', function() {
    
    var content;

    before(function() {
      content = JSON.parse(fs.readFileSync(pathToXMerger, 'utf-8'));
    });

    it('should contain a name for the x-merger', function() {
      assert.ok(content.name);
      assert.ok(content.name == 'x-merger');
    });

    it('should contain a description for the x-merger', function() {
      assert.ok(content.description);
    });

    it('should contain a blurb for the x-merger', function() {
      assert.ok(content.blurb);
    });

    it('should contain a status for the x-merger', function() {
      assert.ok(content.status);
    });

    it('should contain a homepage for the x-merger', function() {
      assert.ok(content.homepage);
    });

    it('should contain a return for the x-merger', function() {
      assert.ok(content.return);
    });

    it('should contain attributes for the x-merger', function() {
      assert.ok(content.attributes);
      assert.ok(content.attributes.length);
    });

    it('should contain properties for the x-merger', function() {
      assert.ok(content.properties);
      assert.ok(content.properties.length);
    });

    it('should contain methods for the x-merger', function() {
      assert.ok(content.methods);
      assert.ok(content.methods.length);
    });

    it('should contain events for the x-merger', function() {
      assert.ok(content.events);
      assert.ok(content.events.length);
    });

  });

});
