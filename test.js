var testHarness = window.testHarness || {};

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
