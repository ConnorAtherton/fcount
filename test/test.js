var assert = require('chai').assert;
var count = require('../src/count');

var commands = {
  basic:    { _: [] },
  noFile:   { _: ['c'], d: true },
  single:   { _: ['java'], d: true },
  multiple: { _: ['js', 'rb', 'json'], d: true },
  hidden:   { _: ['gitignore', 'hidden'], d: true }
}

describe('When no arguments are passed in', function() {
  var result;

  beforeEach(function(done) {
    count(commands.basic, function(counts) {
      result = counts;
      done();
    })
  });

  it('should return a result', function() {
    assert(result);
  });

  it('should return a string.', function() {
    assert.isString(result);
  });

  it('should return an error message.', function() {
    // assert.equal(result, 'Error: fcount expects at least one extension to be passed in.');
  });
});

describe('Using flags', function() {
  var result = null;

  before(function(done) {
    count(commands.noFile, function(counts) {
      result = counts;
      done();
    })
  });

  it('should return an object', function() {
    assert.isObject(result);
  });

  it('should contain the key passed in', function() {
    assert.property(result, 'c');
  });

  it('should return 0 when no file exists', function() {
    assert.propertyVal(result, 'c', 0);
  });

});

describe('Counting files: single', function() {
  var result = null;
  var expected = {
    'java': 1
  };

  before(function(done) {
    count(commands.single, function(counts) {
      result = counts;
      done();
    }, '/test/fixtures');
  });

  it('should count 1 java file', function() {
    assert.propertyVal(result, 'java', 1);
  });

  it('should only contain a java key', function() {
    assert.deepEqual(result, expected);
  });

});

describe('Counting files: multiple', function() {
  var result = null;
  var expected = {
    'js': 4,
    'json': 3,
    'rb': 1
  };

  before(function(done) {
    count(commands.multiple, function(counts) {
      result = counts;
      done();
    }, '/test/fixtures');
  });

  it('should count 4 js files', function() {
    assert.propertyVal(result, 'js', 4);
  });

  it('should count 1 rb file', function() {
    assert.propertyVal(result, 'rb', 1);
  });

  it('should count 3 json files', function() {
    assert.propertyVal(result, 'json', 3);
  });

  it('should only contain js, rb or json keys', function() {
    assert.deepEqual(result, expected);
  });

});

describe('Counting files: hidden', function() {
  var hidden_files;
  var hidden_f_expected = { 'hidden': 0, 'gitignore': 0 }

  var hidden_dirs;
  var hidden_d_expected = { 'java': 1 }

  before(function(done) {
    count(commands.hidden, function(counts) {
      hidden_files = counts;
      done();
    }, '/test/fixtures');
  });

  before(function(done) {
    count(commands.single, function(counts) {
      hidden_dirs = counts;
      done();
    }, '/test/fixtures/');
  })

  it('should not count any hidden files', function() {
    assert.deepEqual(hidden_files, hidden_f_expected);
  });

  it('should not search any hidden directories', function () {
    assert.deepEqual(hidden_dirs, hidden_d_expected );
  });

});
