var testHarness = window.testHarness || {};

var sortingList = [
  {
    start_date: new Date(2012, 8, 15),
    city: 'Seattle'
  },
  {
    start_date: new Date(2012, 10, 19),
    city: 'Omaha'
  }
];

module('sortEvents');
test('sorts the events by city ascending', function () {
  var result, sortedCities;

  result = testHarness.sortEvents(sortingList, function (event) { return event.city; }, 1);
  sortedCities = $.map(result, function (value, index) { return value.city; });

  deepEqual(sortedCities, ['Omaha', 'Seattle']);
});

test('sorts the events by city descending', function () {
  var result, sortedCities;

  result = testHarness.sortEvents(sortingList, function (event) { return event.city; }, -1);
  sortedCities = $.map(result, function (value, index) { return value.city; });

  deepEqual(sortedCities, ['Seattle', 'Omaha']);
});

test('sorts by city ascending by default', function () {
  var result, sortedCities;

  result = testHarness.sortEvents(sortingList);
  sortedCities = $.map(result, function (value, index) { return value.city; });

  deepEqual(sortedCities, ['Omaha', 'Seattle']);
});

test('sorts by ascending by default if direction not passed', function () {
  var result, sortedCities;

  result = testHarness.sortEvents(sortingList, function (event) { return event.city; });
  sortedCities = $.map(result, function (value, index) { return value.city; });

  deepEqual(sortedCities, ['Omaha', 'Seattle']);
});

test('turns sorting attribute into a function if a string is passed', function () {
  var result, sortedCities;

  result = testHarness.sortEvents(sortingList, 'city');
  sortedCities = $.map(result, function (value, index) { return value.city; });

  deepEqual(sortedCities, ['Omaha', 'Seattle']);
});

test('sorts by start_date ascending', function () {
  var result, sortedCities;

  result = testHarness.sortEvents(sortingList, function (event) { return event.start_date; });
  sortedCities = $.map(result, function (value, index) { return value.city; });

  deepEqual(sortedCities, ['Seattle', 'Omaha']);
});

test('sorts by start_date descending', function () {
  var result, sortedCities;

  result = testHarness.sortEvents(sortingList, function (event) { return event.start_date; }, -1);
  sortedCities = $.map(result, function (value, index) { return value.city; });

  deepEqual(sortedCities, ['Omaha', 'Seattle']);
});

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

test('handles the case where there is a trailing slash', function () {
  var result, query;
  query = {
    vertical: 'EDU',
    since: '2011-01-01'
  };

  result = testHarness.buildQueryUrl('http://baseurl/', query);

  equal(result, 'http://baseurl?vertical=EDU&since=2011-01-01');
});

module('isEmptyEvent');
test('returns false for no arguments', function () {
  equal(testHarness.isEmptyEvent(), true);
});

test('returns false for null', function () {
  equal(testHarness.isEmptyEvent(null), true);
});

test('returns false for empty object', function () {
  equal(testHarness.isEmptyEvent({}), true);
});

test('returns true for a good event object', function () {
  var eventData = {
    city: 'Seattle',
    start_date: new Date()
  };
  equal(testHarness.isEmptyEvent(eventData), false);
});

module('eventDisplayTitle');
test('returns an empty string if nothing is passed', function () {
  var result = testHarness.eventDisplayTitle();
  equal(result, '');
});

test('returns an empty string if null is passed', function () {
  var result = testHarness.eventDisplayTitle(null);
  equal(result, '');
});

test('returns an empty string if no title fields are present', function () {
  var result, eventData = {
    anything: 'but',
    what: 'we',
    need: 'for real'
  };

  result = testHarness.eventDisplayTitle(eventData);
  equal(result, '');
});

test('returns event title with nickname if present', function () {
  var result, eventData = {
    nickname: 'Airport'
  };

  result = testHarness.eventDisplayTitle(eventData);
  equal(result, 'Startup Weekend Airport');
});

test('returns event title with vertical if present', function () {
  var result, eventData = {
    vertical: 'EDU'
  };

  result = testHarness.eventDisplayTitle(eventData);
  equal(result, 'Startup Weekend - EDU');
});

test('returns an event title with nickname and vertical combined if both present', function () {
  var result, eventData = {
    nickname: 'Airport',
    vertical: 'EDU'
  };

  result = testHarness.eventDisplayTitle(eventData);
  equal(result, 'Startup Weekend Airport - EDU');
});

test('returns an event title with only the city if it is the only thing present', function () {
  var result, eventData = {
    city: 'Berlin'
  };

  result = testHarness.eventDisplayTitle(eventData);
  equal(result, 'Berlin');
});

test('returns an event title with all location data available', function () {
  var result, eventData = {
    city: 'Seattle',
    state: 'WA',
    country: 'USA'
  };

  result = testHarness.eventDisplayTitle(eventData);
  equal(result, 'Seattle, WA, USA');
});

test('returns a full event title string if all data is present', function () {
  var result, eventData = {
    city: 'Seattle',
    state: 'WA',
    country: 'USA',
    vertical: 'EDU',
    nickname: 'Mega'
  };

  result = testHarness.eventDisplayTitle(eventData);
  equal(result, 'Startup Weekend Mega - EDU, Seattle, WA, USA');
});

module('formatStartDate');
test('returns an empty string when nothing is passed', function () {
  equal(testHarness.formatStartDate(), '');
});

test('returns an empty string when null is passed', function () {
  equal(testHarness.formatStartDate(null), '');
});

test('returns an empty string when an empty object is passed', function () {
  equal(testHarness.formatStartDate({}), '');
});

test('returns an empty string if start_date not present', function () {
  var eventData = {
    city: 'Seattle'
  };

  equal(testHarness.formatStartDate(eventData), '');
});

test('returns an empty string if this is not a date or string type', function () {
  var eventData = {
    city: 'Seattle',
    start_date: [1,2,3]
  };

  equal(testHarness.formatStartDate(eventData), '');
});

test('returns a formatted date when the start_date is a string', function () {
  var eventData = {
    start_date: '2011-01-01'
  };

  equal(testHarness.formatStartDate(eventData), 'Jan 1, 2011');
});

test('returns a formatted_date when the start_date is a different string format', function () {
  var eventData = {
    start_date: 'January 1, 2011'
  };

  equal(testHarness.formatStartDate(eventData), 'Jan 1, 2011');
});

test('returns a formatted date when the start_date is a date', function () {
  var eventData = {
    start_date: new Date(2011, 0, 1)
  };

  equal(testHarness.formatStartDate(eventData), 'Jan 1, 2011');
});

module('generateEventLink');
test('returns an empty string for no argument', function () {
  equal(testHarness.generateEventLink(), '');
});

test('returns an empty string for null argument', function () {
  equal(testHarness.generateEventLink(null), '');
});

test('returns an empty string for an empty event', function () {
  equal(testHarness.generateEventLink({}), '');
});

test('returns a coming soon link for an event with no website', function () {
  var expected, eventData = {
    city: 'Seattle'
  };

  expected = '<a href="#" class="comingSoon">Coming soon</a>';

  equal(testHarness.generateEventLink(eventData), expected);
});

test('returns a coming soon link for an event with a website but no acceptable state', function () {
  var expected, eventData = {
    city: 'Seattle',
    website: 'http://seattle.startupweekend.org',
    event_status: 'T'
  };

  expected = '<a href="#" class="comingSoon">Coming soon</a>';

  equal(testHarness.generateEventLink(eventData), expected);
});

test('returns a Register link for an event with a website and an acceptable state', function () {
  var expected, eventData = {
    city: 'Seattle',
    website: 'http://seattle.startupweekend.org',
    event_status: 'G'
  };

  expected = '<a href="http://seattle.startupweekend.org" target="_blank" class="registerLink">Register</a>';

  equal(testHarness.generateEventLink(eventData), expected);
});

test('automatically adds protocol if not included in website field', function () {
  var expected, eventData = {
    city: 'Seattle',
    website: 'seattle.startupweekend.org',
    event_status: 'G'
  };

  expected = '<a href="http://seattle.startupweekend.org" target="_blank" class="registerLink">Register</a>';

  equal(testHarness.generateEventLink(eventData), expected);
});

module('processEventData');
test('returns an empty table with the headers when no data passed', function () {
  var emptyTable, result;
  emptyTable = '<table class="eventListingTable"><thead><tr><th data-sortattr="city">A-Z \u25be</th><th data-sortattr="start_date">Date \u25be</th><th>&nbsp;</th></tr></thead></table>';

  result = testHarness.processEventData([]);
  equal(result, emptyTable);
});

test('returns an empty table with the headers when null is passed', function () {
  var emptyTable, result;
  emptyTable = '<table class="eventListingTable"><thead><tr><th data-sortattr="city">A-Z \u25be</th><th data-sortattr="start_date">Date \u25be</th><th>&nbsp;</th></tr></thead></table>';

  result = testHarness.processEventData([]);
  equal(result, emptyTable);
});

test('returns some HTML when one event is passed', function () {
  var expected, result, eventList;

  eventList = [{
    city: 'Seattle',
    state: 'WA',
    country: 'USA',
    event_status: 'G',
    start_date: new Date(),
    website: 'http://seattle.startupweekend.org'
  }];

  result = testHarness.processEventData(eventList);

  expected = '<table class="eventListingTable"><thead><tr><th data-sortattr="city">A-Z \u25be</th><th data-sortattr="start_date">Date \u25be</th><th>&nbsp;</th></tr></thead><tbody>' +
    '<tr><td>Seattle, WA, USA</td><td>Sep 10, 2012</td><td>' +
    '<a href="http://seattle.startupweekend.org" target="_blank" class="registerLink">Register</a></td></tr>' +
    '</tbody></table>';

  equal(result, expected);
});

module('integration');
asyncTest('writes HTML to target', function () {
  $('#testTarget').swEventListing({
    url: 'http://localhost:3000/events',
    query: {
      vertical: 'EDU'
    }
  });

  setTimeout(function () {
    ok($('#testTarget').html().length > 0);
    ok($('#testTarget').html().match(/<table class="eventListingTable">/));
    start();
  }, 1000);
});
