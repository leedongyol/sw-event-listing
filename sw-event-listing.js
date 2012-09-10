"use strict";

(function ($) {
  // Functions and top-level declarations
  var testHarness;

  if (window.testHarness) {
    testHarness = window.testHarness;
  }

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
