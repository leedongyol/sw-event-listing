"use strict";

(function ($, moment) {
  // Functions and top-level declarations
  var sortEvents,
      testHarness, objLen, buildQueryUrl, isEmptyEvent,
      eventDisplayTitle, formatStartDate, generateEventLink,
      processEventData, dataFromServer;

  if (window.testHarness) {
    testHarness = window.testHarness;
  }

  /**
   * A non-destructive on the event list
   *
   * @events - The event list to sort
   * @sortAttribute - A function to grab the sorting attribute from the event
   * @direction - Either 1 for ascending or -1 for descending
   */
  sortEvents = function (events, sortAttribute, direction) {
    var comparator, attr, copy = events.slice(0);

    // Default sort ascending
    direction = direction || 1;

    // Default sort by city
    sortAttribute = sortAttribute || function (event) { return event.city; };
    if (typeof sortAttribute !== 'function') {
      attr = sortAttribute;
      sortAttribute = function (event) { return event[attr]; }
    }

    comparator = function (eventA, eventB) {
      var leftVal, rightVal;
      leftVal = sortAttribute(eventA);
      rightVal = sortAttribute(eventB);

      if (leftVal < rightVal) {
        return -1 * direction;
      } else if (leftVal > rightVal) {
        return 1 * direction;
      } else {
        return 0;
      }
    };

    if (copy.sort) {
      return copy.sort(comparator);
    } else {
      // No native sort. Return the original unsorted copy
      return copy;
    }
  };
  testHarness.sortEvents = sortEvents;

  /**
   * Returns the length of the keys of a given object
   *
   * @object - The object to determine the length
   */
  objLen = function (object) {
    var key, length = 0;

    if (object === null || typeof object === 'undefined') {
      return length;
    } else if (object.length && typeof object.length === "number") {
      return object.length;
    } else {
      for (key in object) {
        if (object.hasOwnProperty(key)) { length += 1; }
      }
      return length;
    }
  };
  testHarness.objLen = objLen;

  /**
   * Build a URL with the query parameters added as
   * URL parameters. This URL will represent the API
   * endpoint for getting events
   *
   * @baseUrl - A string representing the base API URL, including the protocol
   * @query - An object holding key-value pairs representing the API query
   */
  buildQueryUrl = function (baseUrl, query) {
    var prop, queryTerms = [];

    if (baseUrl === null || typeof baseUrl === 'undefined' || baseUrl.length === 0) { return ''; };

    if (baseUrl[baseUrl.length - 1] === '/') {
      baseUrl = baseUrl.slice(0, -1);
    }

    if (objLen(query) > 0) {
      for (prop in query) {
        if (query.hasOwnProperty(prop)) {
          queryTerms.push(prop + "=" + query[prop]);
        }
      }

      return baseUrl + "?" + queryTerms.join("&");
    } else {
      return baseUrl;
    };
  };
  testHarness.buildQueryUrl = buildQueryUrl;

  /*
   * Given an event object, return true if the
   * event is defined and non-empty, and false
   * otherwise
   *
   * @eventData - A JSON object representing the event
   */
  isEmptyEvent = function (eventData) {
    if (eventData === null || typeof eventData === 'undefined' || objLen(eventData) === 0) {
      return true;
    } else {
      return false;
    }
  };
  testHarness.isEmptyEvent = isEmptyEvent;

  /**
   * Given a JSON event object, build a display title
   * based on all the available location data
   * (nickname, vertical, city, state, country)
   *
   * @eventData - The JSON object containing the data
   *
   */
  eventDisplayTitle = function (eventData) {
    var nickAndVertical, hasNick, hasVertical, titleTerms = [];

    if (isEmptyEvent(eventData)) {
      return '';
    } else {

      // Walk through all the nickname and vertical logic
      if (eventData.nickname && eventData.nickname.length > 0) { hasNick = true; }
      if (eventData.vertical && eventData.vertical.length > 0) { hasVertical = true; }
      if (hasNick || hasVertical) {
        nickAndVertical = "Startup Weekend";

        if (hasNick) { nickAndVertical += (" " + eventData.nickname); }
        if (hasVertical) { nickAndVertical += (" - " + eventData.vertical); }

        titleTerms.push(nickAndVertical);
      }

      // Work through city/state/country logic
      if (eventData.city && eventData.city.length > 0) {
        titleTerms.push(eventData.city);
      }

      if (eventData.state && eventData.state.length > 0) {
        titleTerms.push(eventData.state);
      }

      if (eventData.country && eventData.country.length > 0) {
        titleTerms.push(eventData.country);
      }

      return titleTerms.join(', ');
    }
  };
  testHarness.eventDisplayTitle = eventDisplayTitle;

  formatStartDate = function (eventData) {
    var dateType = false,
        stringType = false,
        workingDate;

    if (isEmptyEvent(eventData)) {
      return '';
    } else if (!(eventData.start_date) || eventData.start_date === null || typeof eventData.start_date === 'undefined') {
      return '';
    } else {
      // Make sure we are working with a date or a parseable string object
      dateType = eventData.start_date.constructor.toString().match(/Date/);
      stringType = typeof eventData.start_date === 'string';

      if (dateType || stringType) {
        if (stringType) {
          workingDate = moment(eventData.start_date);

          // Bad date format or not even a date?
          if (workingDate._d.toString() === 'Invalid Date') { return ''; }
        } else {
          workingDate = moment(eventData.start_date);
        }

        return workingDate.utc().format('MMM D, YYYY');
      } else {
        return '';
      }
    }
  };
  testHarness.formatStartDate = formatStartDate;

  /*
   * Given an event, return a link to the registration site
   * if the event is ready for registration, or present a
   * "Coming Soon" message otherwise
   */
  generateEventLink = function (eventData) {
    var emptyLink, acceptableState, actualUrl, comingSoonLink = '<a href="#" class="comingSoon">Coming soon</a>';

    if (isEmptyEvent(eventData)) {
      return '';
    } else {
      emptyLink = (typeof eventData.website === 'undefined' || eventData.website === null || eventData.website.length === 0);
      acceptableState = (eventData.event_status && (eventData.event_status === 'W' || eventData.event_status === 'G'));

      if (emptyLink === false && acceptableState) {
        actualUrl = eventData.website.indexOf('http') < 0  ? 'http://' + eventData.website : eventData.website;
        return '<a href="' + actualUrl + '" target="_blank" class="registerLink">Register</a>';
      } else {
        return comingSoonLink;
      }
    }
  };
  testHarness.generateEventLink = generateEventLink;

  /**
   * Takes an array of JSON data and returns the HTML
   * for a table containing the event listing
   *
   * @data - The JSON array of event data
   */
  processEventData = function (data, includeTableDefinition) {
    includeTableDefinition = (typeof includeTableDefinition === 'undefined') ? true : includeTableDefinition;

    var html = [];

    if (includeTableDefinition) {
      html.push('<table class="eventListingTable">');
      html.push('<thead><tr><th data-sortattr="city">A-Z \u25be</th><th data-sortattr="start_date">Date \u25be</th><th>&nbsp;</th></tr></thead>');
    }

    if (data && typeof data !== 'undefined' && objLen(data) > 0) {
      if (includeTableDefinition) {
        html.push('<tbody>');
      }

      $.each(data, function (idx, eventData) {
        html.push('<tr>');
        html.push('<td>' + eventDisplayTitle(eventData) + '</td>');
        html.push('<td>' + formatStartDate(eventData) + '</td>');
        html.push('<td>' + generateEventLink(eventData) + '</td>');
        html.push('</tr>');
      });

      if (includeTableDefinition) {
        html.push('</tbody>');
      }
    }

    if (includeTableDefinition) {
      html.push('</table>');
    }
    return html.join('');
  };
  testHarness.processEventData = processEventData;

  /**
   * This plugin generates an html table based on data points
   * provided by the SWOOP API
   *
   * @opts - The settings for the plugin
   */
  $.fn.swEventListing = function (opts) {
    var defaults, settings, domElement, apiUrl;

    domElement = this[0];

    defaults = {
      url: 'http://swoop.startupweekend.org/events',
      query: {}
    };

    settings = $.extend(defaults, opts);

    apiUrl = buildQueryUrl(settings.url, settings.query);

    $.ajax({
      dataType: 'jsonp',
      url: apiUrl,
      success: function (data) {
        var tableHtml;

        dataFromServer = data;
        tableHtml = processEventData(data);

        $(domElement).html(tableHtml);

        $(domElement).find('th').click(function (evt) {
          var clickedHeader, sortAttr, sortedEvents, newHtml;
          
          clickedHeader = $(evt.currentTarget);
          sortAttr = clickedHeader.data('sortattr');

          sortedEvents = sortEvents(dataFromServer, sortAttr, 1);
          newHtml = processEventData(sortedEvents, false);
          $(domElement).find('tbody').not('thead').html(newHtml);

          evt.preventDefault();
          return false;
        });
      }
    });
  };
}(jQuery, moment));
