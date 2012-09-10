"use strict";

(function ($) {
  // Functions and top-level declarations
  var testHarness, buildQueryUrl;

  if (window.testHarness) {
    testHarness = window.testHarness;
  }

  /**
   * Build a URL with the query parameters added as
   * URL parameters. This URL will represent the API
   * endpoint for getting events
   *
   * @baseUrl - A string representing the base API URL, including the protocol
   * @query - An object holding key-value pairs representing the API query
   */
  buildQueryUrl = function (baseUrl, query) {
    if (query) {
      return '';
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
