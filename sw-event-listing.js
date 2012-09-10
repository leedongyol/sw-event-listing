"use strict";

(function ($) {
  // Functions and top-level declarations
  var testHarness, objLen, buildQueryUrl;

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
