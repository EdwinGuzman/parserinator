/*jslint indent: 2, maxlen: 80, unparam: true */
/*globals angular */

'use strict';

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
        generateApiUrl: function generateApiUrl() {
          var options = arguments[0] === undefined ? {} : arguments[0];
          var host = options.api_root;
          var version = options.api_version;

          var url = undefined;

          if (!host || !version) {
            return undefined;
          }
          url = '' + host + '/' + version;

          return validProtocol(host) ? url : 'http://' + url;
        }
      };
      provider.full_api_url = provider.generateApiUrl(options);

      function validProtocol() {
        var host = arguments[0] === undefined ? '' : arguments[0];

        return host.indexOf('http://') === 0 || host.indexOf('https://') === 0;
      }

      return provider;
    }];
  }

  /**
   * @ngdoc service
   * @name parserinator.service:urlGenerator
   * @description
   * Create URL strings for queries for JSONAPI formatted APIs.
   */
  function urlGenerator() {
    var urlGenerator = {
      createIncludesParams: function createIncludesParams(includes) {
        return includes ? 'include=' + includes.join(',') : '';
      },
      createFieldsParams: function createFieldsParams(fields) {
        var fieldsArray = [],
            field = undefined;

        if (!fields) {
          return '';
        }

        for (field in fields) {
          if (fields.hasOwnProperty(field)) {
            fieldsArray.push('fields[' + field + ']=' + fields[field].join(','));
          }
        }

        return fieldsArray.join('&');
      },
      createParams: function createParams() {
        var opts = arguments[0] === undefined ? {} : arguments[0];

        var includes = opts.includes,
            fields = opts.fields,
            fieldParams = this.createFieldsParams(fields),
            sparseFields = fieldParams ? '&' + fieldParams : '';

        return '?' + this.createIncludesParams(includes) + sparseFields;
      }
    };

    return urlGenerator;
  }
  urlGenerator.$inject = [];

  /**
   * @ngdoc service
   * @name parserinator.service:jsonAPIParser
   * @requires $http
   * @requires $q
   * @requires $jsonAPI
   * @requires urlGenerator
   * @description
   * ...
   */
  function jsonAPIParser($http, $q, $jsonAPI, urlGenerator) {
    // Changing all string declarations to single quotes
    // As per airbnb recommendations https://github.com/airbnb/javascript#strings
    var api = $jsonAPI.full_api_url,
        jsonp_cb = '&callback=JSON_CALLBACK',
        apiError = 'Could not reach API: ';

    var parser = {},
        findInIncludes = undefined,
        getObjectsOfType = undefined;

    function includedGenerator() {
      var included = arguments[0] === undefined ? [] : arguments[0];

      return function (data) {
        return _.findWhere(included, {
          'id': data.id,
          'type': data.type
        });
      };
    };

    function findTypesGenerator() {
      var included = arguments[0] === undefined ? [] : arguments[0];

      return function (type) {
        return _.filter(included, function (obj) {
          return obj.type === type;
        });
      };
    }

    function endpointGenerator(baseEndpoint) {
      var errorStr = arguments[1] === undefined ? 'API Error' : arguments[1];

      return function () {
        var opts = arguments[0] === undefined ? {} : arguments[0];

        var defer = $q.defer(),
            full_api = api + '/' + baseEndpoint,
            params = urlGenerator.createParams(opts),
            endpoint = opts.endpoint ? '/' + opts.endpoint : '';

        full_api += endpoint + params + jsonp_cb;
        console.log('Request: ' + full_api);

        $http.jsonp(full_api, { cache: true }).success(function (data) {
          defer.resolve(data);
        }).error(function (data, status) {
          defer.reject(apiError + errorStr);
        });

        return defer.promise;
      };
    }

    parser.get = function (endpoint, errorStr) {
      return endpointGenerator(endpoint, errorStr);
    };

    parser.parse = function () {
      var apiData = arguments[0] === undefined ? {} : arguments[0];

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

    parser.createHierarchy = function () {
      var included = arguments[0] === undefined ? [] : arguments[0];
      var type = arguments[1] === undefined ? '' : arguments[1];

      var parents = [],
          flatArr = undefined,
          parentObj = undefined,
          parentAlreadyAdded = undefined;

      if (!included || !type) {
        return;
      }

      getObjectsOfType = findTypesGenerator(included);
      findInIncludes = includedGenerator(included);
      flatArr = getObjectsOfType(type);

      _.each(flatArr, function (obj) {
        if (obj.relationships && obj.relationships.parent) {
          parentObj = findInIncludes(obj.relationships.parent.data);

          // found parent in the included array
          if (parentObj) {
            parentAlreadyAdded = _.findWhere(parents, { id: parentObj.id });

            // If the parent object doesn't have a children array, add it
            if (!parentObj.children) {
              parentObj.children = [];
            }

            if (!_.findWhere(parentObj.children, { id: obj.id })) {
              parentObj.children.push(obj);
            }

            // Check to see if the parent object already exists
            // in the parents array
            if (!parentAlreadyAdded) {
              parents.push(parentObj);
            }
          }
        } else {
          parentAlreadyAdded = _.findWhere(parents, { id: obj.id });
          if (!parentAlreadyAdded) {
            parents.push(obj);
          }
        }
      });

      return parents;
    };

    function createArrayModels(data) {
      var dataModels = [];

      if (data.length) {
        dataModels = _.map(data, createObjectModel);
      }

      return dataModels;
    }

    function createObjectModel() {
      var data = arguments[0] === undefined ? {} : arguments[0];

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
          if (dataObj.relationships) {
            dataObj = createRelationships(dataObj, dataObj.relationships);
          }
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
          linkageProperty = relationships[rel]['data'];

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
  jsonAPIParser.$inject = ['$http', '$q', '$jsonAPI', 'urlGenerator'];

  /**
   * @ngdoc overview
   * @module parserinator
   * @name parserinator
   * @description
   * Parse JSON API formatted APIs.
   */
  angular.module('parserinator', []).provider('$jsonAPI', $jsonAPIProvider).factory('jsonAPIParser', jsonAPIParser).factory('urlGenerator', urlGenerator);
})();

// console.log('make http request?');