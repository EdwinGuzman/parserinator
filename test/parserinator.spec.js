/*jslint nomen: true, unparam: true, indent: 2, maxlen: 80 */
/*globals element, by, google, module, window, jasmine, document,
describe, expect, beforeEach, inject, it, angular, spyOn, afterEach */

describe('Parserinator', () => {
  'use strict';

  let mockedBike = {
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

  describe('Broken Module Setup', () => {
    it('should throw an error because no settings were passed', () => {
      let rootScope, $jsonAPI;

      module('parserinator', $jsonAPIProvider => {
        // No settings were passed in the provider
        $jsonAPIProvider.setOptions();
      });

      inject((_$rootScope_, _$jsonAPI_) => {
        rootScope = _$rootScope_;
        $jsonAPI = _$jsonAPI_;
      });

      expect($jsonAPI.full_api_url).not.toBeDefined();
    });

    it('should throw an error because the URL is empty', () => {
      let rootScope, $jsonAPI;

      module('parserinator', $jsonAPIProvider => {
        $jsonAPIProvider.setOptions({
          api_root: '',
          api_version: ''
        });
      });
      inject((_$rootScope_, _$jsonAPI_) => {
        rootScope = _$rootScope_;
        $jsonAPI = _$jsonAPI_;
      });

      expect($jsonAPI.full_api_url).not.toBeDefined();
    });

    it('should throw an error because the API version is empty', () => {
      let rootScope, $jsonAPI;

      module('parserinator', $jsonAPIProvider => {
        $jsonAPIProvider.setOptions({
          api_root: 'http://ilovebikes.com'
        });
      });

      inject((_$rootScope_, _$jsonAPI_) => {
        rootScope = _$rootScope_;
        $jsonAPI = _$jsonAPI_;
      });

      expect($jsonAPI.full_api_url).not.toBeDefined();
    });

    it('should throw an error because the version was passed but not the url',
      () => {
        let rootScope, $jsonAPI;

        module('parserinator', $jsonAPIProvider => {
          $jsonAPIProvider.setOptions({
            api_version: 'v1.0'
          });
        });

        inject((_$rootScope_, _$jsonAPI_) => {
          rootScope = _$rootScope_;
          $jsonAPI = _$jsonAPI_;
        });

        expect($jsonAPI.full_api_url).not.toBeDefined();
      });

    it('should return the API url but with no protocol', () => {
      let rootScope, $jsonAPI;

      module('parserinator', $jsonAPIProvider => {
        $jsonAPIProvider.setOptions({
          api_root: 'ilovebikes.com',
          api_version: 'v1.0'
        });
      });

      inject((_$rootScope_, _$jsonAPI_) => {
        rootScope = _$rootScope_;
        $jsonAPI = _$jsonAPI_;
      });

      expect($jsonAPI.full_api_url).toBeDefined();
      expect($jsonAPI.full_api_url).toBe('http://ilovebikes.com/v1.0');
    });

  }); /* End Broken Module Setup */

  describe('Working Module Setup', () => {
    it('should return the API that will be fetched', () => {
      let rootScope, $jsonAPI;

      module('parserinator', $jsonAPIProvider => {
        $jsonAPIProvider.setOptions({
          api_root: 'http://ilovebikes.com',
          api_version: 'v1.0'
        });
      });

      inject((_$rootScope_, _$jsonAPI_) => {
        rootScope = _$rootScope_;
        $jsonAPI = _$jsonAPI_;
      });

      expect($jsonAPI.full_api_url).toBeDefined();
      expect($jsonAPI.full_api_url).toBe('http://ilovebikes.com/v1.0');
    });

    it('should return the API using https', () => {
      let rootScope, $jsonAPI;

      module('parserinator', $jsonAPIProvider => {
        $jsonAPIProvider.setOptions({
          api_root: 'https://ilovebikes.com',
          api_version: 'v1.0'
        });
      });

      inject((_$rootScope_, _$jsonAPI_) => {
        rootScope = _$rootScope_;
        $jsonAPI = _$jsonAPI_;
      });

      expect($jsonAPI.full_api_url).toBeDefined();
      expect($jsonAPI.full_api_url).toBe('https://ilovebikes.com/v1.0');
    });
  });

  describe('urlGenerator Service', () => {
    let api = 'http://ilovebikes.com',
      api_version = 'v1.0',
      jsonpCallback = '&callback=JSON_CALLBACK',
      error_message = 'Could not reach API: ',
      urlGenerator,
      $rootScope;

    beforeEach(() => {
      module('parserinator', $jsonAPIProvider => {
        $jsonAPIProvider.setOptions({
          api_root: api,
          api_version: api_version
        });
      });

      inject((_$rootScope_, _urlGenerator_) => {
        $rootScope = _$rootScope_;
        urlGenerator = _urlGenerator_;
      });
    });

    describe('urlGenerator.createIncludesParams()', () => {
      it('should exist', () => {
        expect(urlGenerator.createIncludesParams).toBeDefined();
      });

      it('should generate a string', () => {
        let includes = ['derailleur', 'brakes', 'image'],
          includesParams = urlGenerator.createIncludesParams(includes);

        expect(includesParams).toBe('include=derailleur,brakes,image');
      });

      it('should return an empty string is nothing was passed', () => {
        let includesParams = urlGenerator.createIncludesParams();

        expect(includesParams).toBe('');
      });
    }); /* End urlGenerator.createIncludesParams() */

    describe('urlGenerator.createFieldsParams()', () => {
      it('should exist', () => {
        expect(urlGenerator.createFieldsParams).toBeDefined();
      });

      it('should generate a string', () => {
        let fields = {
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

      it('should generate URL params even for empty arrays', () => {
        let fields = {
            'frontDerailleur': [],
            'image': []
          },
          fieldParams = urlGenerator.createFieldsParams(fields);

        expect(fieldParams).toBe('fields[frontDerailleur]=&fields[image]=');
      });

      it('should generate URL params only for nonempty arrays when mixed' +
        ' with other params',
        () => {
          let fields = {
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

      it('should return an empty string if nothing was passed', () => {
        let fieldParams = urlGenerator.createFieldsParams();

        expect(fieldParams).toBe('');
      });
    }); /* End urlGenerator.createFieldsParams() */

    describe('urlGenerator.createParams()', () => {
      it('should exist', () => {
        expect(urlGenerator.createParams).toBeDefined();
      });

      it('should generate a string with includes and fields', () => {
        let includes = ['derailleur', 'brakes', 'image'],
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

      it('should generate a string with just includes', () => {
        let includes = ['derailleur', 'brakes', 'image'],
          options = {
            includes: includes
          },
          params = urlGenerator.createParams(options);

        expect(params).toBe('?include=derailleur,brakes,image');
      });

      it('should return an empty string is nothing was passed', () => {
        let includesParams = urlGenerator.createParams();

        // For now, this returns just a '?' because the HTTP request expects
        // a JSONP callback argument in the URL.
        expect(includesParams).toBe('?');
      });
    }); /* End urlGenerator.createParams() */

  }); /* End urlGenerator Service */

  describe('jsonAPIParser Service', () => {
    let api = 'http://ilovebikes.com',
      api_version = 'v1.0',
      jsonpCallback = '&callback=JSON_CALLBACK',
      error_message = 'Could not reach API: ',
      jsonAPIParser,
      $httpBackend,
      $rootScope;

    beforeEach(() => {

      module('parserinator', $jsonAPIProvider => {
        $jsonAPIProvider.setOptions({
          api_root: api,
          api_version: api_version
        });
      });

      inject((_$rootScope_, _jsonAPIParser_, _$httpBackend_) => {
        $rootScope = _$rootScope_.$new();
        jsonAPIParser = _jsonAPIParser_;
        $httpBackend = _$httpBackend_;
      });
    });

    // afterEach(function () {
    //   $httpBackend.verifyNoOutstandingExpectation();
    //   $httpBackend.verifyNoOutstandingRequest();
    // });

    describe('jsonAPIParser.get()', () => {
      it('should exist', () => {
        expect(jsonAPIParser.get).toBeDefined();
      });

      it('should return an error from the API', () => {
        let bikesEndpoint;

        bikesEndpoint = jsonAPIParser.get('bikes');

        $httpBackend
          .whenJSONP(api + '/' + api_version + '/bikes' + '?' + jsonpCallback)
          .respond(500);

        bikesEndpoint()
          .then(data => {
            return data;
          })
          .catch(err => {
            throw err;
          });

        expect($httpBackend.flush)
          .toThrow('Could not reach API: API Error');
      });

      it('should return a function', () => {
        let bikesEndpoint = jsonAPIParser.get('bikes');

        expect(bikesEndpoint).toBeDefined();
        expect(typeof bikesEndpoint).toBe('function');
      });

      it('should call the API and get data', () => {
        let bikesEndpoint,
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
          .then(data => {
            returnedBikeData = data;
            return data;
          });
        $httpBackend.flush();

        expect(returnedBikeData).toEqual(bike);
      });

      it('should call the API for a collection', () => {
        let bikesEndpoint,
          returnedBikeData;

        bikesEndpoint = jsonAPIParser.get('bikes');

        $httpBackend
          .whenJSONP(api + '/' + api_version + '/bikes' + '?' + jsonpCallback)
          .respond(mockedBikes);

        bikesEndpoint()
          .then(data => {
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

    describe('jsonAPIParser.parse()', () => {
      it('should exist', () => {
        expect(jsonAPIParser.parse).toBeDefined();
      });

      it('should call create relationships from a collection', () => {
        let updatedData = jsonAPIParser.parse(mockedBikes),
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

      it('should call create relationships from an object', () => {
        let updatedData = jsonAPIParser.parse(mockedBike),
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

    describe('jsonAPIParser.createHierarchy()', () => {
      let included;

      beforeEach(() => {
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

      it('should exist', () => {
        expect(jsonAPIParser.createHierarchy).toBeDefined();
      });

      it('should return undefined if now parameters were passed', () => {
        expect(jsonAPIParser.createHierarchy()).toEqual(undefined);
      });

      it('should return undefined if the type was not specified', () => {
        expect(jsonAPIParser.createHierarchy([])).toEqual(undefined);
      });

      it('should return an array with only "tag" types', () => {
        let type = 'tag';

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

      it('should return an array with only "image" types', () => {
        let type = 'image';

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

    }); /* End jsonAPIParser.createHierarchy() */

  }); /* End jsonAPIParser Service */
});


