var testHarness = window.testHarness || {};

module('objLen');
test('returns 0 when no parameters passed', function () {
  var result = testHarness.objLen();
  equal(result, 0);
});

test('returns 0 when null is passed', function () {
  var result = testHarness.objLen(null);
  equal(result, 0);
});

test('returns the length of a given object', function () {
  var result, query;

  query = {
    'a': 1,
    'b': 2
  };

  result = testHarness.objLen(query);

  equal(result, 2);
});

test('returns the length if the object it supports "length"', function () {
  var result, query;

  query = [1, 2, 3, 4, 5];
  
  result = testHarness.objLen(query);

  equal(result, 5);
});

test('returns the length of an array even if it is ampty', function () {
  var result = testHarness.objLen([]);
  equal(result, 0);
});

module('buildQueryUrl');
test('returns baseUrl for an empty query', function () {
  var result = testHarness.buildQueryUrl('http://baseurl', {});
  equal(result, 'http://baseurl');
});

test('returns baseUrl with HTTP parameters', function () {
  var result, query;
  query = {
    vertical: 'EDU',
    since: '2011-01-01'
  };

  result = testHarness.buildQueryUrl('http://baseurl', query);

  equal(result, 'http://baseurl?vertical=EDU&since=2011-01-01');
});
