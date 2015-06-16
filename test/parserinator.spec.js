/*jslint nomen: true, unparam: true, indent: 2, maxlen: 80 */
/*globals element, by, google, module, window, jasmine, document,
describe, expect, beforeEach, inject, it, angular, spyOn, afterEach */

describe('Parserinator', function () {
  'use strict';

  var mockedBike = {
      'data': {
        'id': '1',
        'type': 'bicycle',
        'attributes': {
          'brand': 'Felt',
          'bike-slug': '1'
        },
        'relationships': {
          'derailleur': {
            'data': {
              'type': 'derailleur',
              'id': '1234'
            },
            'links': {
              'self': 'http://ilovebikes.com/v1.0/bikes/links/derailleur'
            }
          },
          'brakes': {
            'data': {
              'type': 'brakes',
              'id': '1235'
            },
            'links': {
              'self': 'http://ilovebikes.com/v1.0/bikes/links/brakes'
            }
          },
          'image': {
            'data': {
              'type': 'image',
              'id': '1232'
            },
            'links': {
              'self': 'http://ilovebikes.com/v1.0/bikes/links/image'
            }
          },
          'tags': {
            'data': [
              {
                'id': '12',
                'type': 'tag'
              },
              {
                'id': '24',
                'type': 'tag'
              },
              {
                'id': '25',
                'type': 'tag'
              }
            ],
            'links': {
              'self': 'http://ilovebikes.com/v1.0/bikes/1/tags'
            }
          }
        }
      },
      'meta': [],
      'links': {
        'self': 'http://ilovebikes.com/v1.0/bikes/1'
      },
      'jsonapi': {
        'version': '1.0'
      },
      'included': [
        {
          'type': 'derailleur',
          'id': '1234',
          'attributes': {
            'location': 'front',
            'brand': 'Shimano'
          },
          'links': {
            'self': 'http://ilovebikes.com/v1.0/derailleur/1234'
          }
        },
        {
          'type': 'brakes',
          'id': '1235',
          'attributes': {
            'location': 'back',
            'brand': 'Shimano'
          },
          'links': {
            'self': 'http://ilovebikes.com/v1.0/brakes/1234'
          }
        },
        {
          'type': 'image',
          'id': '1232',
          'attributes': {
            'uri': {
              'full-uri': 'http://cdn-prod.www.ilovebikes.com/files/images/Felt.jpg',
              'description': 'landscape'
            }
          },
          'links': {
            'self': 'http://ilovebikes.com/v1.0/images/1232'
          }
        },
        {
          'id': '12',
          'type': 'tag',
          'attributes': {
            'name': 'Road'
          },
          'links': {
            'self': 'http://ilovebikes.com/v1.0/tags/12'
          }
        },
        {
          'id': '24',
          'type': 'tag',
          'attributes': {
            'name': 'Felt'
          },
          'links': {
            'self': 'http://ilovebikes.com/v1.0/tags/24'
          }
        },
        {
          'id': '25',
          'type': 'tag',
          'attributes': {
            'name': 'Racing'
          },
          'links': {
            'self': 'http://ilovebikes.com/v1.0/tags/25'
          }
        }
      ]
    },
    mockedBikes = {
      'data': [
        {
          'id': '1',
          'type': 'bicycle',
          'attributes': {
            'brand': 'Felt',
            'bike-slug': '1'
          },
          'relationships': {
            'derailleur': {
              'data': {
                'type': 'derailleur',
                'id': '1234'
              },
              'links': {
                'self': 'http://ilovebikes.com/v1.0/bikes/links/derailleur'
              }
            },
            'tags': {
              'data': [
                {
                  'id': '12',
                  'type': 'tag'
                },
                {
                  'id': '24',
                  'type': 'tag'
                },
                {
                  'id': '25',
                  'type': 'tag'
                }
              ],
              'links': {
                'self': 'http://ilovebikes.com/v1.0/bikes/1/tags'
              }
            }
          }
        },
        {
          'id': '2',
          'type': 'bicycle',
          'attributes': {
            'brand': 'Cannondale',
            'bike-slug': '2'
          },
          'relationships': {
            'image': {
              'data': {
                'type': 'image',
                'id': '1230'
              },
              'links': {
                'self': 'http://ilovebikes.com/v1.0/bikes/links/image'
              }
            },
            'tags': {
              'data': [
                {
                  'id': '12',
                  'type': 'tag'
                },
                {
                  'id': '25',
                  'type': 'tag'
                }
              ],
              'links': {
                'self': 'http://ilovebikes.com/v1.0/bikes/1/tags'
              }
            }
          }
        },
        {
          'id': '3',
          'type': 'bicycle',
          'attributes': {
            'brand': 'Trek',
            'bike-slug': '3'
          },
          'relationships': {
            'image': {
              'data': {
                'type': 'image',
                'id': '1235'
              },
              'links': {
                'self': 'http://ilovebikes.com/v1.0/bikes/links/image'
              }
            },
            'tags': {
              'data': [
                {
                  'id': '12',
                  'type': 'tag'
                },
                {
                  'id': '25',
                  'type': 'tag'
                }
              ],
              'links': {
                'self': 'http://ilovebikes.com/v1.0/bikes/1/tags'
              }
            }
          }
        },
      ],
      'included': [
        {
          'type': 'derailleur',
          'id': '1234',
          'attributes': {
            'location': 'front',
            'brand': 'Shimano'
          },
          'links': {
            'self': 'http://ilovebikes.com/v1.0/derailleur/1234'
          }
        },
        {
          'type': 'image',
          'id': '1230',
          'attributes': {
            'uri': {
              'full-uri': 'http://cdn-prod.www.ilovebikes.com/files/images/cannondale.jpg',
              'description': 'landscape'
            }
          },
          'links': {
            'self': 'http://ilovebikes.com/v1.0/images/1230'
          }
        },
        {
          'type': 'image',
          'id': '1235',
          'attributes': {
            'uri': {
              'full-uri': 'http://cdn-prod.www.ilovebikes.com/files/images/trek.jpg',
              'description': 'landscape'
            }
          },
          'links': {
            'self': 'http://ilovebikes.com/v1.0/images/1235'
          }
        },
        {
          'id': '12',
          'type': 'tag',
          'attributes': {
            'name': 'Road'
          },
          'links': {
            'self': 'http://ilovebikes.com/v1.0/tags/12'
          }
        },
        {
          'id': '24',
          'type': 'tag',
          'attributes': {
            'name': 'Felt'
          },
          'links': {
            'self': 'http://ilovebikes.com/v1.0/tags/24'
          }
        },
        {
          'id': '25',
          'type': 'tag',
          'attributes': {
            'name': 'Racing'
          },
          'links': {
            'self': 'http://ilovebikes.com/v1.0/tags/25'
          }
        }
      ]
    };

  describe('Broken Module Setup', function () {
    it('should throw an error because no settings were passed', function () {
      var rootScope, $jsonAPI;

      module('parserinator', function ($jsonAPIProvider) {
        // No settings were passed in the provider
        $jsonAPIProvider.setOptions();
      });

      inject(function (_$rootScope_, _$jsonAPI_) {
        rootScope = _$rootScope_;
        $jsonAPI = _$jsonAPI_;
      });

      expect($jsonAPI.full_api_url).not.toBeDefined();
    });

    it('should throw an error because the URL is empty', function () {
      var rootScope, $jsonAPI;

      module('parserinator', function ($jsonAPIProvider) {
        $jsonAPIProvider.setOptions({
          api_root: '',
          api_version: ''
        });
      });
      inject(function (_$rootScope_, _$jsonAPI_) {
        rootScope = _$rootScope_;
        $jsonAPI = _$jsonAPI_;
      });

      expect($jsonAPI.full_api_url).not.toBeDefined();
    });

    it('should throw an error because the API version is empty', function () {
      var rootScope, $jsonAPI;

      module('parserinator', function ($jsonAPIProvider) {
        $jsonAPIProvider.setOptions({
          api_root: 'http://ilovebikes.com'
        });
      });

      inject(function (_$rootScope_, _$jsonAPI_) {
        rootScope = _$rootScope_;
        $jsonAPI = _$jsonAPI_;
      });

      expect($jsonAPI.full_api_url).not.toBeDefined();
    });

    it('should throw an error because the version was passed but not the url',
      function () {
        var rootScope, $jsonAPI;

        module('parserinator', function ($jsonAPIProvider) {
          $jsonAPIProvider.setOptions({
            api_version: 'v1.0'
          });
        });

        inject(function (_$rootScope_, _$jsonAPI_) {
          rootScope = _$rootScope_;
          $jsonAPI = _$jsonAPI_;
        });

        expect($jsonAPI.full_api_url).not.toBeDefined();
      });

    it('should return the API url but with no protocol', function () {
      var rootScope, $jsonAPI;

      module('parserinator', function ($jsonAPIProvider) {
        $jsonAPIProvider.setOptions({
          api_root: 'ilovebikes.com',
          api_version: 'v1.0'
        });
      });

      inject(function (_$rootScope_, _$jsonAPI_) {
        rootScope = _$rootScope_;
        $jsonAPI = _$jsonAPI_;
      });

      expect($jsonAPI.full_api_url).toBeDefined();
      expect($jsonAPI.full_api_url).toBe('http://ilovebikes.com/v1.0');
    });

  }); /* End Broken Module Setup */

  describe('Working Module Setup', function () {
    it('should return the API that will be fetched', function () {
      var rootScope, $jsonAPI;

      module('parserinator', function ($jsonAPIProvider) {
        $jsonAPIProvider.setOptions({
          api_root: 'http://ilovebikes.com',
          api_version: 'v1.0'
        });
      });

      inject(function (_$rootScope_, _$jsonAPI_) {
        rootScope = _$rootScope_;
        $jsonAPI = _$jsonAPI_;
      });

      expect($jsonAPI.full_api_url).toBeDefined();
      expect($jsonAPI.full_api_url).toBe('http://ilovebikes.com/v1.0');
    });

    it('should return the API using https', function () {
      var rootScope, $jsonAPI;

      module('parserinator', function ($jsonAPIProvider) {
        $jsonAPIProvider.setOptions({
          api_root: 'https://ilovebikes.com',
          api_version: 'v1.0'
        });
      });

      inject(function (_$rootScope_, _$jsonAPI_) {
        rootScope = _$rootScope_;
        $jsonAPI = _$jsonAPI_;
      });

      expect($jsonAPI.full_api_url).toBeDefined();
      expect($jsonAPI.full_api_url).toBe('https://ilovebikes.com/v1.0');
    });
  });

  describe('urlGenerator Service', function () {
    var api = 'http://ilovebikes.com',
      api_version = 'v1.0',
      jsonpCallback = '&callback=JSON_CALLBACK',
      error_message = 'Could not reach API: ',
      urlGenerator,
      $rootScope;

    beforeEach(function () {
      module('parserinator', function ($jsonAPIProvider) {
        $jsonAPIProvider.setOptions({
          api_root: api,
          api_version: api_version
        });
      });

      inject(function (_$rootScope_, _urlGenerator_) {
        $rootScope = _$rootScope_;
        urlGenerator = _urlGenerator_;
      });
    });

    describe('urlGenerator.createIncludesParams()', function () {
      it('should exist', function () {
        expect(urlGenerator.createIncludesParams).toBeDefined();
      });

      it('should generate a string', function () {
        var includes = ['derailleur', 'brakes', 'image'],
          includesParams = urlGenerator.createIncludesParams(includes);

        expect(includesParams).toBe('include=derailleur,brakes,image');
      });

      it('should return an empty string is nothing was passed', function () {
        var includesParams = urlGenerator.createIncludesParams();

        expect(includesParams).toBe('');
      });
    }); /* End urlGenerator.createIncludesParams() */

    describe('urlGenerator.createFieldsParams()', function () {
      it('should exist', function () {
        expect(urlGenerator.createFieldsParams).toBeDefined();
      });

      it('should generate a string', function () {
        var fields = {
            'frontDerailleur': ['name', 'system', 'year', 'weight'],
            'image': ['name', 'height', 'width', 'uri']
          },
          fieldParams = urlGenerator.createFieldsParams(fields);

        expect(fieldParams)
          .toBe(
            'fields[frontDerailleur]=name,system,year,weight&' +
            'fields[image]=name,height,width,uri'
          );
      });

      it('should generate URL params even for empty arrays', function () {
        var fields = {
            'frontDerailleur': [],
            'image': []
          },
          fieldParams = urlGenerator.createFieldsParams(fields);

        expect(fieldParams).toBe('fields[frontDerailleur]=&fields[image]=');
      });

      it('should generate URL params only for nonempty arrays when mixed' +
        ' with other params',
        function () {
          var fields = {
              'frontDerailleur': ['name', 'system', 'year', 'weight'],
              'image': [],
              'tag': ['name']
            },
            fieldParams = urlGenerator.createFieldsParams(fields);

          expect(fieldParams)
            .toBe(
              'fields[frontDerailleur]=name,system,year,weight&' +
              'fields[image]=&fields[tag]=name'
            );
        });

      it('should return an empty string if nothing was passed', function () {
        var fieldParams = urlGenerator.createFieldsParams();

        expect(fieldParams).toBe('');
      });
    }); /* End urlGenerator.createFieldsParams() */

    describe('urlGenerator.createParams()', function () {
      it('should exist', function () {
        expect(urlGenerator.createParams).toBeDefined();
      });

      it('should generate a string with includes and fields', function () {
        var includes = ['derailleur', 'brakes', 'image'],
          fields = {
            'frontDerailleur': ['name', 'system', 'year', 'weight'],
            'image': ['name', 'height', 'width', 'uri']
          },
          options = {
            includes: includes,
            fields: fields
          },
          params = urlGenerator.createParams(options);

        expect(params)
          .toBe(
            '?include=derailleur,brakes,image&' +
            'fields[frontDerailleur]=name,system,year,weight&' +
            'fields[image]=name,height,width,uri'
          );
      });

      it('should generate a string with just includes', function () {
        var includes = ['derailleur', 'brakes', 'image'],
          options = {
            includes: includes
          },
          params = urlGenerator.createParams(options);

        expect(params).toBe('?include=derailleur,brakes,image');
      });

      it('should return an empty string is nothing was passed', function () {
        var includesParams = urlGenerator.createParams();

        // For now, this returns just a '?' because the HTTP request expects
        // a JSONP callback argument in the URL.
        expect(includesParams).toBe('?');
      });
    }); /* End urlGenerator.createParams() */

  }); /* End urlGenerator Service */

  describe('jsonAPIParser Service', function () {
    var api = 'http://ilovebikes.com',
      api_version = 'v1.0',
      jsonpCallback = '&callback=JSON_CALLBACK',
      error_message = 'Could not reach API: ',
      jsonAPIParser,
      $httpBackend,
      $rootScope;

    beforeEach(function () {

      module('parserinator', function ($jsonAPIProvider) {
        $jsonAPIProvider.setOptions({
          api_root: api,
          api_version: api_version
        });
      });

      inject(function (_$rootScope_, _jsonAPIParser_, _$httpBackend_) {
        $rootScope = _$rootScope_.$new();
        jsonAPIParser = _jsonAPIParser_;
        $httpBackend = _$httpBackend_;
      });
    });

    // afterEach(function () {
    //   $httpBackend.verifyNoOutstandingExpectation();
    //   $httpBackend.verifyNoOutstandingRequest();
    // });

    describe('jsonAPIParser.get()', function () {
      it('should exist', function () {
        expect(jsonAPIParser.get).toBeDefined();
      });

      it('should return an error from the API', function () {
        var bikesEndpoint;

        bikesEndpoint = jsonAPIParser.get('bikes');

        $httpBackend
          .whenJSONP(api + '/' + api_version + '/bikes' + '?' + jsonpCallback)
          .respond(500);

        bikesEndpoint()
          .then(function (data) {
            return data;
          })
          .catch(function (err) {
            throw err;
          });

        expect($httpBackend.flush)
          .toThrow('Could not reach API: API Error');
      });

      it('should return a function', function () {
        var bikesEndpoint = jsonAPIParser.get('bikes');

        expect(bikesEndpoint).toBeDefined();
        expect(typeof bikesEndpoint).toBe('function');
      });

      it('should call the API and get data', function () {
        var bikesEndpoint,
          bike = {
            data: {
              id: '1',
              type: 'bicycle',
              attributes: {
                brand: 'Felt'
              }
            }
          },
          returnedBikeData;

        bikesEndpoint = jsonAPIParser.get('bikes');

        $httpBackend
          .whenJSONP(api + '/' + api_version + '/bikes' + '?' + jsonpCallback)
          .respond(bike);

        bikesEndpoint()
          .then(function (data) {
            returnedBikeData = data;
            return data;
          });
        $httpBackend.flush();

        expect(returnedBikeData).toEqual(bike);
      });

      it('should call the API for a collection', function () {
        var bikesEndpoint,
          returnedBikeData;

        bikesEndpoint = jsonAPIParser.get('bikes');

        $httpBackend
          .whenJSONP(api + '/' + api_version + '/bikes' + '?' + jsonpCallback)
          .respond(mockedBikes);

        bikesEndpoint()
          .then(function (data) {
            returnedBikeData = data;
            return data;
          });
        $httpBackend.flush();

        expect(returnedBikeData).toEqual(mockedBikes);
        expect(returnedBikeData.data.length).toBe(3);
        // The relationships are not set yet.
        expect(returnedBikeData.data[0]).not.toEqual({
          'id': '1',
          'type': 'bicycle',
          'attributes': {
            'brand': 'Felt',
            'bike-slug': '1'
          },
          'relationships': {
            'derailleur': {
              'data': {
                'type': 'part',
                'id': '1234'
              },
              'links': {
                'self': 'http://ilovebikes.com/v1.0/bikes/links/derailleur'
              }
            },
            'tags': {
              'data': [
                {
                  'id': '12',
                  'type': 'tag'
                },
                {
                  'id': '24',
                  'type': 'tag'
                },
                {
                  'id': '25',
                  'type': 'tag'
                }
              ],
              'links': {
                'self': 'http://ilovebikes.com/v1.0/bikes/1/tags'
              }
            }
          },
          'derailleur': {
            'type': 'part',
            'id': '1234',
            'attributes': {
              'location': 'front',
              'brand': 'Shimano'
            },
            'links': {
              'self': 'http://ilovebikes.com/v1.0/parts/derailleur/1234'
            }
          }
        });

        expect(returnedBikeData.data[0]).toEqual({
          'id': '1',
          'type': 'bicycle',
          'attributes': {
            'brand': 'Felt',
            'bike-slug': '1'
          },
          'relationships': {
            'derailleur': {
              'data': {
                'type': 'derailleur',
                'id': '1234'
              },
              'links': {
                'self': 'http://ilovebikes.com/v1.0/bikes/links/derailleur'
              }
            },
            'tags': {
              'data': [
                {
                  'id': '12',
                  'type': 'tag'
                },
                {
                  'id': '24',
                  'type': 'tag'
                },
                {
                  'id': '25',
                  'type': 'tag'
                }
              ],
              'links': {
                'self': 'http://ilovebikes.com/v1.0/bikes/1/tags'
              }
            }
          }
        });

      });
    }); /* End jsonAPIParser.get() */

    describe('jsonAPIParser.parse()', function () {
      it('should exist', function () {
        expect(jsonAPIParser.parse).toBeDefined();
      });

      it('should call create relationships from a collection', function () {
        var updatedData = jsonAPIParser.parse(mockedBikes),
          expectedData = {
            'data': [
              {
                'id': '1',
                'type': 'bicycle',
                'attributes': {
                  'brand': 'Felt',
                  'bike-slug': '1'
                },
                'relationships': {
                  'derailleur': {
                    'data': {
                      'type': 'derailleur',
                      'id': '1234'
                    },
                    'links': {
                      'self': 'http://ilovebikes.com/v1.0/bikes/links/derailleur'
                    }
                  },
                  'tags': {
                    'data': [
                      {
                        'id': '12',
                        'type': 'tag'
                      },
                      {
                        'id': '24',
                        'type': 'tag'
                      },
                      {
                        'id': '25',
                        'type': 'tag'
                      }
                    ],
                    'links': {
                      'self': 'http://ilovebikes.com/v1.0/bikes/1/tags'
                    }
                  }
                },
                'derailleur': {
                  'type': 'derailleur',
                  'id': '1234',
                  'attributes': {
                    'location': 'front',
                    'brand': 'Shimano'
                  },
                  'links': {
                    'self': 'http://ilovebikes.com/v1.0/derailleur/1234'
                  }
                },
                'tag': [
                  {
                    'id': '12',
                    'type': 'tag',
                    'attributes': {
                      'name': 'Road'
                    },
                    'links': {
                      'self': 'http://ilovebikes.com/v1.0/tags/12'
                    }
                  },
                  {
                    'id': '24',
                    'type': 'tag',
                    'attributes': {
                      'name': 'Felt'
                    },
                    'links': {
                      'self': 'http://ilovebikes.com/v1.0/tags/24'
                    }
                  },
                  {
                    'id': '25',
                    'type': 'tag',
                    'attributes': {
                      'name': 'Racing'
                    },
                    'links': {
                      'self': 'http://ilovebikes.com/v1.0/tags/25'
                    }
                  }
                ]
              },
              {
                'id': '2',
                'type': 'bicycle',
                'attributes': {
                  'brand': 'Cannondale',
                  'bike-slug': '2'
                },
                'relationships': {
                  'image': {
                    'data': {
                      'type': 'image',
                      'id': '1230'
                    },
                    'links': {
                      'self': 'http://ilovebikes.com/v1.0/bikes/links/image'
                    }
                  },
                  'tags': {
                    'data': [
                      {
                        'id': '12',
                        'type': 'tag'
                      },
                      {
                        'id': '25',
                        'type': 'tag'
                      }
                    ],
                    'links': {
                      'self': 'http://ilovebikes.com/v1.0/bikes/1/tags'
                    }
                  }
                },
                'image': {
                  'type': 'image',
                  'id': '1230',
                  'attributes': {
                    'uri': {
                      'full-uri': 'http://cdn-prod.www.ilovebikes.com/files/images/cannondale.jpg',
                      'description': 'landscape'
                    }
                  },
                  'links': {
                    'self': 'http://ilovebikes.com/v1.0/images/1230'
                  }
                },
                'tag': [
                  {
                    'id': '12',
                    'type': 'tag',
                    'attributes': {
                      'name': 'Road'
                    },
                    'links': {
                      'self': 'http://ilovebikes.com/v1.0/tags/12'
                    }
                  },
                  {
                    'id': '25',
                    'type': 'tag',
                    'attributes': {
                      'name': 'Racing'
                    },
                    'links': {
                      'self': 'http://ilovebikes.com/v1.0/tags/25'
                    }
                  }
                ]
              },
              {
                'id': '3',
                'type': 'bicycle',
                'attributes': {
                  'brand': 'Trek',
                  'bike-slug': '3'
                },
                'relationships': {
                  'image': {
                    'data': {
                      'type': 'image',
                      'id': '1235'
                    },
                    'links': {
                      'self': 'http://ilovebikes.com/v1.0/bikes/links/image'
                    }
                  },
                  'tags': {
                    'data': [
                      {
                        'id': '12',
                        'type': 'tag'
                      },
                      {
                        'id': '25',
                        'type': 'tag'
                      }
                    ],
                    'links': {
                      'self': 'http://ilovebikes.com/v1.0/bikes/1/tags'
                    }
                  }
                },
                'image': {
                  'type': 'image',
                  'id': '1235',
                  'attributes': {
                    'uri': {
                      'full-uri': 'http://cdn-prod.www.ilovebikes.com/files/images/trek.jpg',
                      'description': 'landscape'
                    }
                  },
                  'links': {
                    'self': 'http://ilovebikes.com/v1.0/images/1235'
                  }
                },
                'tag': [
                  {
                    'id': '12',
                    'type': 'tag',
                    'attributes': {
                      'name': 'Road'
                    },
                    'links': {
                      'self': 'http://ilovebikes.com/v1.0/tags/12'
                    }
                  },
                  {
                    'id': '25',
                    'type': 'tag',
                    'attributes': {
                      'name': 'Racing'
                    },
                    'links': {
                      'self': 'http://ilovebikes.com/v1.0/tags/25'
                    }
                  }
                ]
              }
            ]
          };

        expect(updatedData).toEqual(expectedData.data);
      });

      it('should call create relationships from an object', function () {
        var updatedData = jsonAPIParser.parse(mockedBike),
          expectedData = {
            'data': {
              'id': '1',
              'type': 'bicycle',
              'attributes': {
                'brand': 'Felt',
                'bike-slug': '1'
              },
              'relationships': {
                'derailleur': {
                  'data': {
                    'type': 'derailleur',
                    'id': '1234'
                  },
                  'links': {
                    'self': 'http://ilovebikes.com/v1.0/bikes/links/derailleur'
                  }
                },
                'brakes': {
                  'data': {
                    'type': 'brakes',
                    'id': '1235'
                  },
                  'links': {
                    'self': 'http://ilovebikes.com/v1.0/bikes/links/brakes'
                  }
                },
                'image': {
                  'data': {
                    'type': 'image',
                    'id': '1232'
                  },
                  'links': {
                    'self': 'http://ilovebikes.com/v1.0/bikes/links/image'
                  }
                },
                'tags': {
                  'data': [
                    {
                      'id': '12',
                      'type': 'tag'
                    },
                    {
                      'id': '24',
                      'type': 'tag'
                    },
                    {
                      'id': '25',
                      'type': 'tag'
                    }
                  ],
                  'links': {
                    'self': 'http://ilovebikes.com/v1.0/bikes/1/tags'
                  }
                }
              },
              'derailleur': {
                'type': 'derailleur',
                'id': '1234',
                'attributes': {
                  'location': 'front',
                  'brand': 'Shimano'
                },
                'links': {
                  'self': 'http://ilovebikes.com/v1.0/derailleur/1234'
                }
              },
              'brakes': {
                'type': 'brakes',
                'id': '1235',
                'attributes': {
                  'location': 'back',
                  'brand': 'Shimano'
                },
                'links': {
                  'self': 'http://ilovebikes.com/v1.0/brakes/1234'
                }
              },
              'image': {
                'type': 'image',
                'id': '1232',
                'attributes': {
                  'uri': {
                    'full-uri': 'http://cdn-prod.www.ilovebikes.com/files/images/Felt.jpg',
                    'description': 'landscape'
                  }
                },
                'links': {
                  'self': 'http://ilovebikes.com/v1.0/images/1232'
                }
              },
              'tag': [
                {
                  'id': '12',
                  'type': 'tag',
                  'attributes': {
                    'name': 'Road'
                  },
                  'links': {
                    'self': 'http://ilovebikes.com/v1.0/tags/12'
                  }
                },
                {
                  'id': '24',
                  'type': 'tag',
                  'attributes': {
                    'name': 'Felt'
                  },
                  'links': {
                    'self': 'http://ilovebikes.com/v1.0/tags/24'
                  }
                },
                {
                  'id': '25',
                  'type': 'tag',
                  'attributes': {
                    'name': 'Racing'
                  },
                  'links': {
                    'self': 'http://ilovebikes.com/v1.0/tags/25'
                  }
                }
              ]
            }
          };

        expect(updatedData).toEqual(expectedData.data);
      });
    }); /* End jsonAPIParser.parse() */

    describe('jsonAPIParser.createHierarchy()', function () {
      var included;

      beforeEach(function () {
        included = [
          {
            'type': 'derailleur',
            'id': '1234',
            'attributes': {
              'location': 'front',
              'brand': 'Shimano'
            },
            'links': {
              'self': 'http://ilovebikes.com/v1.0/derailleur/1234'
            }
          },
          {
            'type': 'image',
            'id': '1230',
            'attributes': {
              'uri': {
                'full-uri': 'http://cdn-prod.www.ilovebikes.com/files/images/cannondale.jpg',
                'description': 'landscape'
              }
            },
            'links': {
              'self': 'http://ilovebikes.com/v1.0/images/1230'
            }
          },
          {
            'type': 'image',
            'id': '1235',
            'attributes': {
              'uri': {
                'full-uri': 'http://cdn-prod.www.ilovebikes.com/files/images/trek.jpg',
                'description': 'landscape'
              }
            },
            'links': {
              'self': 'http://ilovebikes.com/v1.0/images/1235'
            }
          },
          {
            'id': '12',
            'type': 'tag',
            'attributes': {
              'name': 'Road'
            },
            'links': {
              'self': 'http://ilovebikes.com/v1.0/tags/12'
            }
          },
          {
            'id': '24',
            'type': 'tag',
            'attributes': {
              'name': 'Felt'
            },
            'links': {
              'self': 'http://ilovebikes.com/v1.0/tags/24'
            }
          },
          {
            'id': '25',
            'type': 'tag',
            'attributes': {
              'name': 'Racing'
            },
            'links': {
              'self': 'http://ilovebikes.com/v1.0/tags/25'
            }
          }
        ];
      });

      it('should exist', function () {
        expect(jsonAPIParser.createHierarchy).toBeDefined();
      });

      it('should return undefined if now parameters were passed', function () {
        expect(jsonAPIParser.createHierarchy()).toEqual(undefined);
      });

      it('should return undefined if the type was not specified', function () {
        expect(jsonAPIParser.createHierarchy([])).toEqual(undefined);
      });

      it('should return an array with only "tag" types', function () {
        var type = 'tag';

        expect(jsonAPIParser.createHierarchy(included, type))
          .toEqual([
              {
              'id': '12',
              'type': 'tag',
              'attributes': {
                'name': 'Road'
              },
              'links': {
                'self': 'http://ilovebikes.com/v1.0/tags/12'
              }
            },
            {
              'id': '24',
              'type': 'tag',
              'attributes': {
                'name': 'Felt'
              },
              'links': {
                'self': 'http://ilovebikes.com/v1.0/tags/24'
              }
            },
            {
              'id': '25',
              'type': 'tag',
              'attributes': {
                'name': 'Racing'
              },
              'links': {
                'self': 'http://ilovebikes.com/v1.0/tags/25'
              }
            }
            ]);
      });

      it('should return an array with only "image" types', function () {
        var type = 'image';

        expect(jsonAPIParser.createHierarchy(included, type))
          .toEqual([
              {
                'type': 'image',
                'id': '1230',
                'attributes': {
                  'uri': {
                    'full-uri': 'http://cdn-prod.www.ilovebikes.com/files/images/cannondale.jpg',
                    'description': 'landscape'
                  }
                },
                'links': {
                  'self': 'http://ilovebikes.com/v1.0/images/1230'
                }
              },
              {
                'type': 'image',
                'id': '1235',
                'attributes': {
                  'uri': {
                    'full-uri': 'http://cdn-prod.www.ilovebikes.com/files/images/trek.jpg',
                    'description': 'landscape'
                  }
                },
                'links': {
                  'self': 'http://ilovebikes.com/v1.0/images/1235'
                }
              }
            ]);
      });

      it('should an array with only "tag" type but with parent and children' +
        ' hierarchy in place', function () {
          var included = [
            {
              'type': 'derailleur',
              'id': '1234',
              'attributes': {
                'location': 'front',
                'brand': 'Shimano'
              },
              'links': {
                'self': 'http://ilovebikes.com/v1.0/derailleur/1234'
              }
            },
            {
              'id': '12',
              'type': 'tag',
              'attributes': {
                'name': 'Road'
              },
              'relationships': {
                'parent': {
                  'data': {
                    'type': 'tag',
                    'id': '13'
                  },
                  'links': {
                    'self': 'http://ilovebikes.com/v1.0/tags/13'
                  }
                }
              },
              'links': {
                'self': 'http://ilovebikes.com/v1.0/tags/12'
              }
            },
            {
              'id': '24',
              'type': 'tag',
              'attributes': {
                'name': 'Felt'
              },
              'links': {
                'self': 'http://ilovebikes.com/v1.0/tags/24'
              }
            },
            {
              'id': '25',
              'type': 'tag',
              'attributes': {
                'name': 'Racing'
              },
              'relationships': {
                'parent': {
                  'data': {
                    'type': 'tag',
                    'id': '15'
                  },
                  'links': {
                    'self': 'http://ilovebikes.com/v1.0/tags/15'
                  }
                }
              },
              'links': {
                'self': 'http://ilovebikes.com/v1.0/tags/25'
              }
            },
            {
              'id': '13',
              'type': 'tag',
              'attributes': {
                'name': 'Brand'
              },
              'links': {
                'self': 'http://ilovebikes.com/v1.0/tags/13'
              }
            },
            {
              'id': '15',
              'type': 'tag',
              'attributes': {
                'name': 'Competition'
              },
              'links': {
                'self': 'http://ilovebikes.com/v1.0/tags/15'
              }
            }
          ];

          expect(jsonAPIParser.createHierarchy(included, 'tag'))
            .toEqual([
                {
                  'id': '13',
                  'type': 'tag',
                  'attributes': {
                    'name': 'Brand'
                  },
                  'links': {
                    'self': 'http://ilovebikes.com/v1.0/tags/13'
                  },
                  'children': [
                    {
                      'id': '12',
                      'type': 'tag',
                      'attributes': {
                        'name': 'Road'
                      },
                      'relationships': {
                        'parent': {
                          'data': {
                            'type': 'tag',
                            'id': '13'
                          },
                          'links': {
                            'self': 'http://ilovebikes.com/v1.0/tags/13'
                          }
                        }
                      },
                      'links': {
                        'self': 'http://ilovebikes.com/v1.0/tags/12'
                      },
                    }
                  ]
                },
                {
                  'id': '24',
                  'type': 'tag',
                  'attributes': {
                    'name': 'Felt'
                  },
                  'links': {
                    'self': 'http://ilovebikes.com/v1.0/tags/24'
                  }
                },
                {
                  'id': '15',
                  'type': 'tag',
                  'attributes': {
                    'name': 'Competition'
                  },
                  'links': {
                    'self': 'http://ilovebikes.com/v1.0/tags/15'
                  },
                  'children': [
                    {
                      'id': '25',
                      'type': 'tag',
                      'attributes': {
                        'name': 'Racing'
                      },
                      'relationships': {
                        'parent': {
                          'data': {
                            'type': 'tag',
                            'id': '15'
                          },
                          'links': {
                            'self': 'http://ilovebikes.com/v1.0/tags/15'
                          }
                        }
                      },
                      'links': {
                        'self': 'http://ilovebikes.com/v1.0/tags/25'
                      }
                    }
                  ]
                }
              ]);
        });

    }); /* End jsonAPIParser.createHierarchy() */

  }); /* End jsonAPIParser Service */
});


