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
  generate(FIXTURES, OUTPUT, { merge: true, config: 'test/fixtures/config.json' });
}

describe('config merge extends', function() {

  before(function() {
    reset();
  });

  var pathToXMerger = path.join(OUTPUT, 'x-merger.json');

  describe('output', function() {
    
    it('should generate a JSON file for x-merger', function() {
      var exists = fs.existsSync(pathToXMerger);
      assert.ok(exists);
    });

  });

  describe('x-merger content', function() {
    var content;

    before(function() {
      content = JSON.parse(fs.readFileSync(pathToXMerger, 'utf-8'))
    });

    it('should contain an extends section', function() {
      assert.ok(content.extends);
      assert.ok(content.extends.length);
    });

    it('should extend x-extendee', function() {
      assert.ok(content.extends[0].name == 'x-extendee');
    });

    describe('parentMethods', function() {
      
      it('should contain a parentMethods section', function() {
        assert.ok(content.parentMethods);
        assert.ok(content.parentMethods.length);
      });

      it('should contain methods from extends elements', function() {
        var extendsMethods;
        content.parentMethods.forEach(function(methods) {
          if (methods.name == 'x-extendee') {
            extendsMethods = methods;
          }
        });

        assert.ok(extendsMethods);
        assert.ok(extendsMethods.methods.length);
        assert.ok(extendsMethods.methods[0].name == 'sayGoodbye');
      });

    });

  });
  
});
