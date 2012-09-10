"use strict";

(function ($) {
  // Functions and top-level declarations
  var testHarness, objLen, buildQueryUrl, eventDisplayTitle, processEventData;

  if (window.testHarness) {
    testHarness = window.testHarness;
  }

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

    if (eventData === null || typeof eventData === 'undefined' || objLen(eventData) === 0) {
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

  /**
   * Takes an array of JSON data and returns the HTML
   * for a table containing the event listing
   *
   * @data - The JSON array of event data
   */
  processEventData = function (data) {
    var html = [];
    html.push('<table>');
    html.push('<thead><tr><th>A-Z</th><th>Date</th><th>&nbsp;</th></tr></thead>');

    if (data && typeof data !== 'undefined' && objLen(data) > 0) {
      html.push('<tbody>');
      $.each(data, function (idx, eventData) {
        html.push('<tr>');
        html.push('<td>' + eventData.city + '</td>');
        html.push('<td>' + eventData.start_date + '</td>');
        html.push('<td>' + eventData.website + '</td>');
        html.push('</tr>');
      });

      html.push('</tbody>');
    }

    html.push('</table>');
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
    var defaults, settings;

    defaults = {
      url: 'http://swoop.startupweekend.org/events',
      query: {}
    };

    settings = $.extend(defaults, opts);
  };
})(jQuery);
