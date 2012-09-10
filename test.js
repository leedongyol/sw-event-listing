var testHarness = window.testHarness || {};

module('buildQueryUrl');
test('returns baseUrl for an empty query', function () {
  var result = testHarness.buildQueryUrl('http://baseurl', {});
  equal(result, 'http://baseurl');
});

