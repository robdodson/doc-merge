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
  generate(FIXTURES, OUTPUT);
}

describe('basic mixins', function() {

  before(function() {
    reset();
  });

  var pathToXHasMixin = path.join(OUTPUT, 'x-has-mixin.json');
  var pathToXIsMixin = path.join(OUTPUT, 'IsMixin.json');

  describe('output', function() {

    it('should generate a JSON file for x-has-mixin', function() {
      var exists = fs.existsSync(pathToXHasMixin);
      assert.ok(exists);
    });

    it('should generate a JSON file for x-is-mixin', function() {
      var exists = fs.existsSync(pathToXIsMixin);
      assert.ok(exists);
    });

  });

  describe('x-has-mixin content', function() {

    var content;

    before(function() {
      content = JSON.parse(fs.readFileSync(pathToXHasMixin, 'utf-8'));
    });

    it('should contain a mixins section', function() {
      assert.ok(content.mixins);
      assert.ok(content.mixins.length);
    });
    
    it('should mixin Polymer.IsMixin', function() {
      assert.ok(content.mixins[0].name == 'Polymer.IsMixin');
    });

  });

});
