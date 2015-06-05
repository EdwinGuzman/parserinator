/*jslint indent: 2, maxlen: 80 */
/*globals module */

module.exports = function (config) {
  'use strict';

  config.set({
    basePath : '../',
    files : [
      'components/angular/angular.js',
      'components/angular-mocks/*.js',
      'components/underscore/underscore.js',
      'parserinator.js',
      'test/unit/*.js',
    ],
    exclude : [],
    autoWatch : true,
    frameworks: ['jasmine'],
    browsers : ['Chrome'],
    plugins : [
      'karma-junit-reporter',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-script-launcher',
      'karma-jasmine',
      'karma-ng-html2js-preprocessor',
      'karma-coverage'
    ],
    reporters: ['progress', 'coverage'],
    preprocessors: {
      'parserinator.js': ['coverage']
    },
    coverageReporter: {
      type: 'html',
      dir: 'test/coverage/'
    }
  });
};
