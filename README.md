# Parserinator

### How to use

#### Setup
Load the module into your app and pass in the API root URL and version:
```javascript
    angular
        .module("app-name", [
            "parserinator"
        ])
        .config(['$jsonAPIProvider', function ($jsonAPIProvider) {
            // ...
            $jsonAPIProvider.setOptions({
                api_root: "http://ilovebikes.com",
                api_version: "v1.0"
            });
        }]);
```

#### Calling the service
The Parserinator has a service to call your API server and get data from endpoints you designate. Use the `.get()` method from the `jsonAPIParser` service to generate the endpoint you want.

```javascript
    // If your API has multiple endpoints, you can specify which one you want.
    // The API root URL has already been set in the config.
    // Let's say that your collection of bikes lives on /bikes.
    var bikesEndpoint = jsonAPIParser.get('/bikes');

    // bikesEndpoint returns a promise that calls the /bikes endpoint

    bikesEndpoint()
        .then(function (data) {
            // This will return the raw response.
            return data;
        })
        .catch(function (error) {
            throw error;
        });

    // If we want to fetch a specific bike such as /bikes/10,
    // pass in the endpoint to the bikesEndpoint function.
    var options = {
        endpoint: '10'
    };

    bikesEndpoint(options)
        .then(function (data) {
            // This will return the raw response.
            return data;
        })
        .catch(function (error) {
            throw error;
        });
```

#### Includes and sparse fieldsets
If your JSON API server supports includes and sparse fieldsets, you may include those in the options passed to your endpoint function.

```javascript
    var bikesEndpoint = jsonAPIParser.get('/bikes');
    var includes = ['derailleur', 'brakes', 'image'];
    var fields = {
        "frontDerailleur": ['name', 'system', 'year', 'weight'],
        "image": ['name', 'height', 'width', 'uri']
    };
    var options = {
        includes: includes,
        fields: fields
    };

    bikesEndpoint(options)
        .then(function (data) {
            // This will return the raw response.
            return data;
        })
        .catch(function (error) {
            throw error;
        });
```

#### Building relationships
The `jsonAPIParser` service has a method `.parse()` that will build relationships for you based on the API response `data` and `includes` properties. This will simply fetch the relationships that the data objects contain from the `includes` array and attach it to the appropriate data object. Modeling the data thereafter is left to the user.

```javascript
    bikesEndpoint(options)
        .then(function (data) {
            return jsonAPIParser.parse(data);
        })
        .catch(function (error) {
            throw error;
        });
```

#### Example
You may call the service in your controller but the preference at NYPL is to resolve promises and get data in the router. Following Todd Motto's [Opinionated AngularJS styleguide for teams](http://toddmotto.com/opinionated-angular-js-styleguide-for-teams/) blog post, you can call the service in a function that is passed to the router's resolve property.

```javascript
    angular
        .module("app-name", [
            "parserinator",
            "ui.router"
        ])
        .config(['$jsonAPIProvider, $stateProvider', function ($jsonAPIProvider, $stateProvider) {
            // ...
            $stateProvider
                .state('home', {
                    url: '/',
                    templateUrl: 'views/bikes.html',
                    controller: 'bikesCtrl',
                    resolve: {
                        data: GetData
                    }
                })
                .state('bike', {
                    url: '/:id',
                    templateUrl: 'views/bikeView.html',
                    controller: 'bikeCtrl',
                    resolve: {
                        data: GetData
                    }
                });

            function getData($stateParams, jsonAPIParser) {
                var bikesEndpoint = jsonAPIParser.get('/bikes'),
                    includes = ['derailleur', 'brakes', 'image'],
                    fields = {
                        "frontDerailleur": ['name', 'system', 'year', 'weight'],
                        "image": ['name', 'height', 'width', 'uri']
                    },
                    options = {
                        // The following properties are optional. If a specific
                        // parameter is passed, it will be fetched.
                        endpoint: $stateParams.id,
                        includes: includes,
                        fields: fields
                    };

                return bikesEndpoint(options)
                    .then(function (data) {
                        // This will return the raw response.
                        return data;
                    })
                    .catch(function (error) {
                        throw error;
                    });
            }
        }]);
```

#### Name
At [NYPL](https://github.com/NYPL) we have been adding '-inator' to the end of our projects.

Check out
* [Locinator](http://nypl.org/locations)
* [Researchinator](http://nypl.org/research-divisions)
* Staffinator - a work in progress

We've been working with AngularJS for these past projects and the backend team has adopted the [{json:api}](http://jsonapi.org/) specification for building APIs. This is an AngularJS module to get and parse APIs in the JSON API format.

