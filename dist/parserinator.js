/*jslint indent: 2, maxlen: 80, unparam: true */
/*globals angular */

"use strict";

;(function () {

  /** @namespace $jsonAPIProvider */
  function $jsonAPIProvider() {
    var options = {
      api_root: null,
      api_version: null
    };

    this.setOptions = function (opts) {
      angular.extend(options, opts);
    };

    this.$get = [function () {
      var provider = {
        generateApiUrl: function generateApiUrl(options) {
          var host = options.api_root,
              version = options.api_version,
              url = undefined;

          if (!host || !version) {
            return undefined;
          }
          url = "" + host + "/" + version;

          return validProtocol(host) ? url : "http://" + url;
        }
      };
      provider.full_api_url = provider.generateApiUrl(options);

      function validProtocol(host) {
        return host.indexOf("http://") === 0 || host.indexOf("https://") === 0;
      }

      return provider;
    }];
  }

  /**
   * @ngdoc service
   * @name parserinator.service:jsonAPIParser
   * @requires $http
   * @requires $q
   * @requires $jsonAPI
   * @description
   * ...
   */
  function jsonAPIParser($http, $q, $jsonAPI) {
    var api = $jsonAPI.full_api_url,
        jsonp_cb = "&callback=JSON_CALLBACK",
        apiError = "Could not reach API";

    var parser = {},
        findInIncludes = undefined;

    function includedGenerator(included) {
      return function (data) {
        return _.findWhere(included, {
          "id": data.id,
          "type": data.type
        });
      };
    };

    function createIncludesParams(includes) {
      return includes ? "include=" + includes.join(",") : "";
    }

    function createFieldsParams(fields) {
      var fieldsArray = [],
          field = undefined;

      if (!fields) {
        return "";
      }

      for (field in fields) {
        if (fields.hasOwnProperty(field)) {
          fieldsArray.push("fields[\"" + field + "\"]=" + fields[field].join(","));
        }
      }

      return fieldsArray.join("&");
    }

    function createParams(opts) {
      var includes = opts.includes,
          fields = opts.fields,
          fieldParams = createFieldsParams(fields),
          sparseFields = fieldParams ? "&" + fieldParams : "";

      return "?" + createIncludesParams(includes) + sparseFields;
    }

    function endpointGenerator(baseEndpoint, errorStr) {
      return function (opts) {
        var defer = $q.defer(),
            endpointError = errorStr || "",
            full_api = api + "/" + baseEndpoint,
            params = createParams(opts),
            endpoint = opts.endpoint ? "/" + opts.endpoint : "";

        full_api += endpoint + params + jsonp_cb;
        console.log("Request: " + full_api);

        $http.jsonp(full_api, { cache: true }).success(function (data) {
          defer.resolve(data);
        }).error(function (data, status) {
          defer.reject(apiError + endpointError);
        });

        return defer.promise;
      };
    }

    parser.get = function (endpoint, errorStr) {
      return endpointGenerator(endpoint, errorStr);
    };

    parser.parse = function (apiData) {
      var data = apiData.data,
          included = apiData.included ? apiData.included : [],
          processedData = undefined;

      findInIncludes = includedGenerator(included);

      // The data is an array if we are fetching multiple objects
      if (Array.isArray(data)) {
        processedData = createArrayModels(data);
      } else {
        // If we are fetching one specific profile, then it is
        // simply an object, per the JSON API docs.
        processedData = createObjectModel(data);
      }

      return processedData;
    };

    function createArrayModels(data) {
      var dataModels = [];

      _.each(data, function (datum) {
        dataModels.push(createObjectModel(datum));
      });

      return dataModels;
    }

    function createObjectModel(data) {
      var objectModel = angular.copy(data),
          relationships = objectModel.relationships;

      objectModel = createRelationships(objectModel, relationships);

      return objectModel;
    }

    function makeHTTPRequest() {}

    function constructObjFromIncluded(linkageProperty) {
      var dataObj = {};

      dataObj = findInIncludes(linkageProperty);

      if (dataObj && dataObj.relationships) {
        dataObj = createRelationships(dataObj, dataObj.relationship);
      }

      return dataObj;
    }

    function constructArrayFromIncluded(linkageProperty) {
      var includedDataArray = [],
          dataObj = {};

      // Loop through each object in the array and find the
      // corresponding data from the included array.
      _.each(linkageProperty, function (linkageProp) {
        dataObj = constructObjFromIncluded(linkageProp);

        if (dataObj) {
          includedDataArray.push(dataObj);
        } else {
          makeHTTPRequest();
        }
      });

      return includedDataArray;
    }

    function createRelationships(objectModel, relationships) {
      var includedDataObj = {},
          includedDataArray = [],
          linkageProperty = undefined,
          key = undefined;

      for (var rel in relationships) {
        if (relationships.hasOwnProperty(rel)) {
          linkageProperty = relationships[rel]["data"];

          // If it contains a linkage object property
          if (linkageProperty) {
            if (Array.isArray(linkageProperty)) {
              // All have the same type but only need to get it from one object
              key = linkageProperty[0].type;

              includedDataArray = constructArrayFromIncluded(linkageProperty);

              if (includedDataArray.length) {
                // return the data in an array.
                objectModel[key] = includedDataArray;
              }
            } else {
              includedDataObj = constructObjFromIncluded(linkageProperty);

              if (includedDataObj) {
                key = linkageProperty.type;
                objectModel[key] = includedDataObj;
              } else {
                makeHTTPRequest();
              }
            }
          }
        }
      }

      return objectModel;
    }

    return parser;
  }
  jsonAPIParser.$inject = ["$http", "$q", "$jsonAPI"];

  /**
   * @ngdoc overview
   * @module parserinator
   * @name parserinator
   * @description
   * ..
   */
  angular.module("parserinator", []).provider("$jsonAPI", $jsonAPIProvider).factory("jsonAPIParser", jsonAPIParser);
})();

// console.log('make http request?');