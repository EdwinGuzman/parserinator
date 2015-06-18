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
      const provider = {
        generateApiUrl(options = {}) {
          const {api_root: host, api_version: version} = options;
          let url;

          if (!host || !version) {
            return undefined;
          }
          url = `${host}/${version}`;

          return validProtocol(host) ? url : `http://${url}`;
        }
      };
      provider.full_api_url = provider.generateApiUrl(options);

      function validProtocol(host = '') {
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
    const urlGenerator = {
      createIncludesParams(includes) {
        return includes ? `include=${includes.join(',')}` : '';
      },
      createFieldsParams(fields) {
        let fieldsArray = [],
          field;

        if (!fields) {
          return '';
        }

        for (field in fields) {
          if (fields.hasOwnProperty(field)) {
            fieldsArray.push(`fields[${field}]=${fields[field].join(',')}`);
          }
        }

        return fieldsArray.join('&');
      },
      createParams(opts = {}) {
        let includes = opts.includes,
          fields = opts.fields,
          fieldParams = this.createFieldsParams(fields),
          sparseFields = fieldParams ? `&${fieldParams}` : ""; 

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
    const api = $jsonAPI.full_api_url,
      jsonp_cb = '&callback=JSON_CALLBACK',
      apiError = 'Could not reach API: ';

    let parser = {},
      findInIncludes,
      getObjectsOfType;

    function includedGenerator(included = []) {
      return data => {
        return _.findWhere(included, {
          'id': data.id,
          'type': data.type
        });
      };
    };

    function findTypesGenerator(included = []) {
      return type => _.filter(included, obj => obj.type === type);
    }

    function endpointGenerator(baseEndpoint, errorStr = 'API Error') {
      return (opts = {}) => {
        let defer = $q.defer(),
          full_api = api + '/' + baseEndpoint,
          params = urlGenerator.createParams(opts),
          endpoint = opts.endpoint ? '/' + opts.endpoint : '';

        full_api += endpoint + params + jsonp_cb;
        console.log('Request: ' + full_api);

        $http.jsonp(full_api, {cache: true})
          .success(data => {
            defer.resolve(data);
          })
          .error((data, status) => {
            defer.reject(apiError + errorStr);
          });

        return defer.promise;
      };
    }

    parser.get = (endpoint, errorStr) => {
      return endpointGenerator(endpoint, errorStr);
    };

    parser.parse = (apiData = {}) => {
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

    parser.createHierarchy = (included = [], type = '') => {
      let parents = [],
        flatArr,
        parentObj,
        parentAlreadyAdded;

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
            parentAlreadyAdded = _.findWhere(parents, {id: parentObj.id});

            if (parentAlreadyAdded) {
              // If the parent object doesn't have a children array, add it
              if (!parentObj.children) {
                parentObj.children = [];
              }
              
              if (!_.findWhere(parentObj.children, {id: obj.id})) {
                parentObj.children.push(obj);
              }

              // Check to see if the parent object already exists
              // in the parents array
              if (!parentAlreadyAdded) {
                parents.push(parentObj);
              }
            } else {
              parents.push(obj);
            }
          }
        } else {
          parentAlreadyAdded = _.findWhere(parents, {id: obj.id});
          if (!parentAlreadyAdded) {
            parents.push(obj);
          }
        }
      });

      return parents;
    };

    function createArrayModels(data) {
      let dataModels = [];

      if (data.length) {
        dataModels = _.map(data, createObjectModel);
      }

      return dataModels;
    }

    function createObjectModel(data = {}) {
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
  jsonAPIParser.$inject = ['$http', '$q', '$jsonAPI', 'urlGenerator'];

  /**
   * @ngdoc overview
   * @module parserinator
   * @name parserinator
   * @description
   * Parse JSON API formatted APIs.
   */
  angular
    .module('parserinator', [])
    .provider('$jsonAPI', $jsonAPIProvider)
    .factory('jsonAPIParser', jsonAPIParser)
    .factory('urlGenerator', urlGenerator);

}());