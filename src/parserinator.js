/*jslint indent: 2, maxlen: 80, unparam: true */
/*globals angular */

;(() => {

  /** @namespace $jsonAPIProvider */
  function $jsonAPIProvider() {
    const options = {
        api_root: null,
        api_version: null
      };

    this.setOptions = opts => {
      angular.extend(options, opts);
    };

    this.$get = [() => {
      let provider = {
        generateApiUrl(options) {
          let host = options.api_root,
            version = options.api_version,
            url;

          if (!host || !version) {
            return undefined;
          }
          url = host + "/" + version;

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
    const api = $jsonAPI.full_api_url,
      jsonp_cb = '&callback=JSON_CALLBACK',
      apiError = 'Could not reach API';

    let parser = {},
      findInIncludes;

    function includedGenerator(included) {
      return data => {
        return _.findWhere(included, {
          'id': data.id,
          'type': data.type
        });
      };
    };

    function createIncludesParams(includes) {
      return includes ? 'include=' + includes.join(',') : '';
    }

    function createFieldsParams(fields) {
      let fieldsArray = [],
        field;

      if (!fields) {
        return "";
      }

      for (field in fields) {
        if (fields.hasOwnProperty(field)) {
          fieldsArray.push("fields[" + field + "]=" + fields[field].join(','));
        }
      }

      return fieldsArray.join("&");
    }

    function createParams(opts) {
      let includes = opts.includes,
        fields = opts.fields;

      return "?" + createIncludesParams(includes) +
        "&" + createFieldsParams(opts.fields);
    }

    function endpointGenerator(baseEndpoint, errorStr) {
      return opts => {
        let defer = $q.defer(),
          endpointError = errorStr || '',
          full_api = api + '/' + baseEndpoint,
          params = createParams(opts),
          endpoint = opts.endpoint ? '/' + opts.endpoint : '';

        full_api += endpoint + params + jsonp_cb;

        $http.jsonp(full_api, {cache: true})
          .success(data => {
            defer.resolve(data);
          })
          .error((data, status) => {
            defer.reject(apiError + endpointError);
          });

        return defer.promise;
      };
    }

    parser.get = (endpoint, errorStr) => {
      return endpointGenerator(endpoint, errorStr);
    };

    parser.parse = (apiData) => {
      let data = apiData.data,
        included = apiData.included ? apiData.included : [],
        processedData;

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
      let dataModels = [];

      _.each(data, function (datum) {
        dataModels.push(createObjectModel(datum));
      });

      return dataModels;
    }

    function createObjectModel(data) {
      let objectModel = angular.copy(data),
        relationships = objectModel.relationships;

      objectModel = createRelationships(objectModel, relationships);

      return objectModel;
    }

    function makeHTTPRequest() {
      // console.log('make http request?');
    }

    function constructObjFromIncluded(linkageProperty) {
      let dataObj = {};

      dataObj = findInIncludes(linkageProperty);

      if (dataObj && dataObj.relationships) {
        dataObj = createRelationships(dataObj, dataObj.relationship);
      }

      return dataObj;
    }

    function constructArrayFromIncluded(linkageProperty) {
      let includedDataArray = [], dataObj = {};

      // Loop through each object in the array and find the
      // corresponding data from the included array.
      _.each(linkageProperty, linkageProp => {
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
      let includedDataObj = {},
        includedDataArray = [],
        linkageProperty,
        key;

      for (let rel in relationships) {
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
  jsonAPIParser.$inject = ['$http', '$q', '$jsonAPI'];

  /**
   * @ngdoc overview
   * @module parserinator
   * @name parserinator
   * @description
   * ..
   */
  angular
    .module('parserinator', [])
    .provider('$jsonAPI', $jsonAPIProvider)
    .factory('jsonAPIParser', jsonAPIParser);

}());
