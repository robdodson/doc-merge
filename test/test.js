var getEntities = require('../index.js');
var fs = require('fs');
var path = require('path');
var assert = require('assert');

var FIXTURES = path.join(__dirname, 'fixtures');

describe('getEntities', function() {
  it('should return an array when parsing a file', function() {
    var fixture = fs.readFileSync(path.join(FIXTURES, 'paper-tabs/paper-tabs.html'), {encoding:'utf8'});
    var actual = getEntities(fixture);
    assert.ok(Array.isArray(actual));
  });


});
