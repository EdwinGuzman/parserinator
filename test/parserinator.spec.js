/*jslint nomen: true, unparam: true, indent: 2, maxlen: 80 */
/*globals element, by, google, module, window, jasmine, document,
describe, expect, beforeEach, inject, it, angular, spyOn, afterEach */

describe("Parserinator", function () {
  "use strict";

  describe("Broken Module Setup", function () {
    it("should throw an error because settings were passed", function () {
      var rootScope, $jsonAPI;

      // Note that no settings were passed in the provider
      module("parserinator", function ($jsonAPIProvider) {
        $jsonAPIProvider.setOptions();
      });
      inject(function (_$rootScope_, _$jsonAPI_) {
        rootScope = _$rootScope_;
        $jsonAPI = _$jsonAPI_;
      });

      expect($jsonAPI.full_api_url).not.toBeDefined();
    });

    // DO NOT pass API URL or version.
    it("should throw an error because no URL was added", function () {
      var rootScope, $jsonAPI;

      // Note that no settings were passed in the provider
      module("parserinator", function ($jsonAPIProvider) {
        $jsonAPIProvider.setOptions({
          api_root: "",
          api_version: ""
        });
      });
      inject(function (_$rootScope_, _$jsonAPI_) {
        rootScope = _$rootScope_;
        $jsonAPI = _$jsonAPI_;
      });

      expect($jsonAPI.full_api_url).not.toBeDefined();
    });

    // Passed API URL and version but the API is down or
    // returning an error.
    it("should throw an error because no API version was passed", function () {
      var rootScope, $jsonAPI, CURRENT_API = "test";

      module("parserinator", function ($jsonAPIProvider) {
        $jsonAPIProvider.setOptions({
          api_root: "http://dev.locations.api.nypl.org/api"
        });
      });

      inject(function (_$rootScope_, _$jsonAPI_) {
        rootScope = _$rootScope_;
        $jsonAPI = _$jsonAPI_;
      });

      expect($jsonAPI.full_api_url).not.toBeDefined()
    });

    it("should throw an error because no URL was passed", function () {
      var rootScope, $jsonAPI, CURRENT_API = "test";

      module("parserinator", function ($jsonAPIProvider) {
        $jsonAPIProvider.setOptions({
          api_version: "v1.0"
        });
      });

      inject(function (_$rootScope_, _$jsonAPI_) {
        rootScope = _$rootScope_;
        $jsonAPI = _$jsonAPI_;
      });

      expect($jsonAPI.full_api_url).not.toBeDefined()
    });
  }); /* End Broken Module Setup */
});
